/* =====================================================================
 * RANDOMCRAFT 1.1 — Overworld expansion
 * Vanilla+ world regions, wildlife, field gear, ruins and ambient life.
 * This module is deliberately additive: existing biome ids, save ids,
 * structures and combat contracts remain intact.
 * ===================================================================== */
const RC_EXPANSION = Object.freeze({
  version: '1.1.0',
  biomes: ['Autumn Woodland','Wildflower Meadow','Redwood Forest','Misty Marsh','Windworn Highlands'],
  mobs: ['deer','cave_mite'],
  items: ['Trail Spear','Hunter Bow','Trail Ration','Animal Hide','Chitin']
});

/* New biome ids are appended; the original eight ids are save-compatible. */
BIOME.AUTUMN = 8;
BIOME.MEADOW = 9;
BIOME.REDWOOD = 10;
BIOME.MARSH = 11;
BIOME.HIGHLANDS = 12;
BIOME_NAME[8] = 'Autumn Woodland';
BIOME_NAME[9] = 'Wildflower Meadow';
BIOME_NAME[10] = 'Redwood Forest';
BIOME_NAME[11] = 'Misty Marsh';
BIOME_NAME[12] = 'Windworn Highlands';

const rcBaseTerrainInfo = terrainInfo;
terrainInfo = function(x,z){
  const base = rcBaseTerrainInfo(x,z);
  if(base.h < SEA + 2 || base.h > WH - 10) return base;
  const climate = fbm2(x*.0019,z*.0019,SEED+6111,3);
  const moisture = fbm2(x*.0027,z*.0027,SEED+6222,3);
  const region = fbm2(x*.0009,z*.0009,SEED+6333,3);
  let b = base.b;
  if(b===BIOME.FOREST && climate>.57 && moisture>.48) b=BIOME.AUTUMN;
  else if(b===BIOME.PLAINS && moisture>.57 && climate>.43) b=BIOME.MEADOW;
  else if((b===BIOME.FOREST||b===BIOME.BIRCH) && moisture<.39 && climate<.49) b=BIOME.REDWOOD;
  else if((b===BIOME.PLAINS||b===BIOME.FOREST) && moisture>.63 && climate<.48) b=BIOME.MARSH;
  else if(b===BIOME.MOUNTAIN && region>.53) b=BIOME.HIGHLANDS;
  return {h:base.h,b};
};

const rcBaseTopBlock = topBlock;
topBlock = function(b,h,x,z){
  if(b===BIOME.AUTUMN||b===BIOME.MEADOW||b===BIOME.REDWOOD)return B.GRASS;
  if(b===BIOME.MARSH)return (h<SEA+4?B.CLAY:B.GRASS);
  if(b===BIOME.HIGHLANDS)return h>SEA+38?B.SNOWGRASS:B.STONE;
  return rcBaseTopBlock(b,h,x,z);
};
const rcBaseFillerBlock = fillerBlock;
fillerBlock = function(b){
  if(b===BIOME.MARSH)return B.CLAY;
  if(b===BIOME.HIGHLANDS)return B.STONE;
  return rcBaseFillerBlock(b);
};
const rcBaseTreeAt = treeAt;
treeAt = function(x,z){
  const old=rcBaseTreeAt(x,z);
  if(old)return old;
  const ci=colInfo(x,z);
  if(ci.h<=SEA+1)return null;
  let density=0,type=0;
  if(ci.b===BIOME.AUTUMN){density=.047;type=0;}
  else if(ci.b===BIOME.MEADOW){density=.004;type=0;}
  else if(ci.b===BIOME.REDWOOD){density=.062;type=2;}
  else if(ci.b===BIOME.MARSH){density=.012;type=2;}
  else if(ci.b===BIOME.HIGHLANDS&&ci.h<SEA+42){density=.018;type=2;}
  if(!density||h2(x,z,SEED+6421)>=density)return null;
  return {h:ci.h,th:5+((h2(x,z,SEED+6422)*5)|0),type};
};

/* Three compact, seed-stable structures make exploration feel less empty.
   The 112-block grid avoids clumping with the existing village grid. */
const RC_STRUCT_GRID=112;
const RC_STRUCT_CACHE=new Map();
const RC_CHEST_PENDING=[];
const RC_CHEST_QUEUED=new Set();
function rcQueueChest(x,y,z){const k=SEED+':'+DIM+':'+x+','+y+','+z;if(!RC_CHEST_QUEUED.has(k)){RC_CHEST_QUEUED.add(k);RC_CHEST_PENDING.push([x,y,z,k,SEED]);}}
function rcStructureCell(gx,gz){
  const key=SEED+':'+gx+','+gz;
  if(RC_STRUCT_CACHE.has(key))return RC_STRUCT_CACHE.get(key);
  if(h2(gx*13+5,gz*13-7,SEED+6501)>.34){RC_STRUCT_CACHE.set(key,null);return null;}
  const x=gx*RC_STRUCT_GRID+22+Math.floor(h2(gx,gz,SEED+6502)*(RC_STRUCT_GRID-44));
  const z=gz*RC_STRUCT_GRID+22+Math.floor(h2(gx,gz,SEED+6503)*(RC_STRUCT_GRID-44));
  const ci=colInfo(x,z);
  if(ci.h<SEA+3||ci.h>WH-14||ci.b===BIOME.OCEAN||ci.b===BIOME.DESERT||
     (typeof mgNoStruct==='function'&&mgNoStruct(x,z))){
    RC_STRUCT_CACHE.set(key,null);return null;
  }
  /* Keep a generous buffer around the alien settlements and buried vaults. */
  for(let ax=-1;ax<=1;ax++)for(let az=-1;az<=1;az++){
    if(typeof vCell==='function'&&vCell(Math.floor(x/112)+ax,Math.floor(z/112)+az)){
      const v=vCell(Math.floor(x/112)+ax,Math.floor(z/112)+az);
      if(v&&Math.hypot(v.cx-x,v.cz-z)<48){RC_STRUCT_CACHE.set(key,null);return null;}
    }
  }
  const out={x,z,y:ci.h,kind:Math.floor(h2(gx,gz,SEED+6504)*3),biome:ci.b};
  RC_STRUCT_CACHE.set(key,out);
  if(RC_STRUCT_CACHE.size>1200)RC_STRUCT_CACHE.clear();
  return out;
}
function rcStampStructures(blocks,x0,z0){
  const g0x=Math.floor((x0-14)/RC_STRUCT_GRID),g1x=Math.floor((x0+CH+14)/RC_STRUCT_GRID);
  const g0z=Math.floor((z0-14)/RC_STRUCT_GRID),g1z=Math.floor((z0+CH+14)/RC_STRUCT_GRID);
  for(let gx=g0x;gx<=g1x;gx++)for(let gz=g0z;gz<=g1z;gz++){
    const s=rcStructureCell(gx,gz);if(!s)continue;
    const {x,z,y,kind}=s;
    const put=(wx,wy,wz,id)=>{
      const lx=wx-x0,lz=wz-z0;
      if(lx<0||lx>=CH||lz<0||lz>=CH||wy<1||wy>=WH)return;
      const i=bidx(lx,wy,lz);
      if(blocks[i]===B.AIR||wy===y){
        blocks[i]=id;
        if(id===B.RC_LANTERN)torches.add(bkey(wx,wy,wz));
      }
    };
    if(kind===0){
      /* A broken roadside watch post with a useful cache on its upper deck. */
      for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++){
        put(x+dx,y,z+dz,B.RC_SLATE);
        if(Math.abs(dx)===2&&Math.abs(dz)===2)
          for(let h=1;h<=6;h++)put(x+dx,y+h,z+dz,B.LOG_O);
      }
      for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)put(x+dx,y+6,z+dz,B.RC_DARK_PLANK);
      put(x,y+7,z,B.RC_LANTERN);
      put(x+1,y+7,z,B.CHEST);
      if(x+1>=x0&&x+1<x0+CH&&z>=z0&&z<z0+CH)rcQueueChest(x+1,y+7,z);
    }else if(kind===1){
      /* An overgrown stone ring, with a broken central marker. */
      for(let dx=-5;dx<=5;dx++)for(let dz=-5;dz<=5;dz++){
        const d=Math.hypot(dx,dz);
        if(d>3.5&&d<5.4&&h2(x+dx,z+dz,SEED+6505)>.16)put(x+dx,y,z+dz,B.RC_MOSS_BRICK);
      }
      for(const [dx,dz] of [[0,-4],[4,0],[0,4],[-4,0]]){
        put(x+dx,y+1,z+dz,B.COBBLE);
        if(h2(x+dx,z+dz,SEED+6506)>.35)put(x+dx,y+2,z+dz,B.COBBLE);
      }
      put(x,y+1,z,B.TORCH);
    }else{
      /* A tiny abandoned camp: low tent, fire ring and a supply chest. */
      for(let dx=-3;dx<=3;dx++)for(let dz=-2;dz<=2;dz++){
        if(Math.abs(dx)<=2&&Math.abs(dz)<=1)put(x+dx,y,z+dz,B.PLANK_S);
      }
      for(let dx=-2;dx<=2;dx++){
        put(x+dx,y+1,z-2,B.WOOL);put(x+dx,y+1,z+2,B.WOOL);
      }
      put(x-2,y+2,z,B.WOOL);put(x+2,y+2,z,B.WOOL);
      put(x+3,y+1,z,B.CHEST);
      if(x+3>=x0&&x+3<x0+CH&&z>=z0&&z<z0+CH)rcQueueChest(x+3,y+1,z);
      put(x-3,y+1,z,B.RC_LANTERN);
    }
  }
}
const rcBaseGenChunk=genChunk;
genChunk=function(cx,cz){
  const blocks=rcBaseGenChunk(cx,cz);
  if(DIM==='over')rcStampStructures(blocks,cx*CH,cz*CH);
  return blocks;
};

/* Field gear and drops. Item ids are appended without changing existing ids. */
IT.RC_SPEAR=290;
IT.RC_RATION=291;
IT.RC_HIDE=292;
IT.RC_CHITIN=293;
IT.RC_HUNTER_BOW=294;
idef(IT.RC_SPEAR,{name:'Trail Spear',icon:'rc_spear',stack:1,dur:260,
  tool:{type:'sword',tier:1,mult:1.1,dur:260,dmg:6.5}});
idef(IT.RC_RATION,{name:'Trail Ration',icon:'rc_ration',food:7});
idef(IT.RC_HUNTER_BOW,{name:'Hunter Bow',icon:'rc_hunterbow',stack:1,bow:true,dur:180});
idef(IT.RC_HIDE,{name:'Animal Hide',icon:'rc_hide'});
idef(IT.RC_CHITIN,{name:'Chitin',icon:'rc_chitin'});
tile('rc_spear',c=>{
  c.clearRect(0,0,16,16);c.fillStyle='#8a633c';c.fillRect(7,5,2,10);
  c.fillStyle='#c9d3dc';c.fillRect(6,1,4,5);c.fillRect(5,4,6,2);
  c.fillStyle='#e9f0f5';c.fillRect(7,1,2,3);
});
tile('rc_ration',c=>{
  c.clearRect(0,0,16,16);c.fillStyle='#9b6337';c.fillRect(3,5,10,8);
  c.fillStyle='#d9b56c';c.fillRect(4,4,8,2);c.fillStyle='#6b8b45';c.fillRect(5,8,6,2);
  c.fillStyle='#f0d69a';c.fillRect(4,12,8,1);
});
tile('rc_hunterbow',c=>{
  c.clearRect(0,0,16,16);c.strokeStyle='#9b6337';c.lineWidth=2;
  c.beginPath();c.moveTo(5,1);c.quadraticCurveTo(14,8,5,15);c.stroke();
  c.strokeStyle='#d9d2b5';c.lineWidth=1;c.beginPath();c.moveTo(5,1);c.lineTo(5,15);c.stroke();
  c.fillStyle='#d7b36b';c.fillRect(4,7,3,2);
});
tile('rc_hide',c=>{
  c.clearRect(0,0,16,16);c.fillStyle='#a87845';c.fillRect(3,3,10,10);
  c.fillStyle='#d0a16a';c.fillRect(5,4,6,7);c.fillStyle='#78502f';c.fillRect(4,11,8,2);
});
tile('rc_chitin',c=>{
  c.clearRect(0,0,16,16);c.fillStyle='#4e7765';c.fillRect(4,2,8,12);
  c.fillStyle='#8fc2a4';c.fillRect(5,3,6,3);c.fillRect(5,8,6,2);
  c.fillStyle='#284c40';c.fillRect(3,6,2,5);c.fillRect(11,6,2,5);
});
R(['  S',' I ','S  '],{S:IT.STICK,I:IT.IRON},IT.RC_SPEAR,1);
R(['STH','S H','STH'],{S:IT.STICK,T:IT.STRING,H:IT.RC_HIDE},IT.RC_HUNTER_BOW,1);
R([' M ','SAS',' M '],{M:IT.STEAK,S:IT.APPLE,A:IT.APPLE},IT.RC_RATION,2);

/* Two new creatures use the established mob rig, physics, drops and XP loop. */
MOBT.deer={hp:14,hw:.38,h:1.8,spd:1.28,quad:true,body:'#a8794d',legc:'#69472f',
  drop:{id:IT.RC_HIDE,min:1,max:2},xp:3};
MOBT.cave_mite={hp:15,hw:.32,h:1.05,spd:1.42,hostile:true,nightOnly:true,dmg:2,
  body:'#55796a',legc:'#263c35',drop:{id:IT.RC_CHITIN,min:1,max:2},xp:4};

/* Give the new wildlife silhouettes of their own rather than reusing a
   humanoid placeholder: a long-legged deer and a low, many-legged cave mite. */
const rcBaseMakeMobMesh=makeMobMesh;
makeMobMesh=function(mt,opts){
  if(mt==='cave_mite'){
    const G=new THREE.Group(),legs=[],mats=[];
    const add=(w,h,d,col,x,y,z)=>{
      const m=boxMesh(w,h,d,col);m.position.set(x,y,z);G.add(m);mats.push(m.material);return m;
    };
    add(.72,.32,1.02,'#344e43',0,.43,0);
    add(.48,.28,.46,'#263a32',0,.48,.61);
    add(.16,.12,.12,'#d85c48',-.15,.52,.86);
    add(.16,.12,.12,'#d85c48',.15,.52,.86);
    add(.08,.13,.08,'#b9c6a1',-.12,.76,.58);
    add(.08,.13,.08,'#b9c6a1',.12,.76,.58);
    for(let i=0;i<4;i++)for(const side of [-1,1]){
      const g=new THREE.Group();
      const a=boxMesh(.48,.09,.1,'#536f5e');a.position.x=side*.22;g.add(a);mats.push(a.material);
      const b=boxMesh(.42,.075,.085,'#263b32');b.position.set(side*.58,-.04,.02);g.add(b);mats.push(b.material);
      g.position.set(side*.27,.38,-.42+i*.28);g.rotation.z=side*.42;G.add(g);
      legs.push({g,ph:i*1.45+(side>0?0:Math.PI),ax:'z',base:side*.42,amp:.62});
    }
    return {G,legs,mats};
  }
  const out=rcBaseMakeMobMesh(mt,opts);
  if(mt==='deer'&&out&&out.G){
    const add=(w,h,d,col,x,y,z)=>{
      const m=boxMesh(w,h,d,col);m.position.set(x,y,z);out.G.add(m);out.mats.push(m.material);return m;
    };
    for(const side of [-1,1]){
      add(.09,.18,.1,'#8c6543',side*.22,1.37,.72);
      add(.055,.27,.055,'#d8c29a',side*.2,1.56,.78);
      add(.19,.055,.055,'#d8c29a',side*.29,1.62,.78);
      add(.055,.18,.055,'#d8c29a',side*.39,1.7,.78);
    }
  }
  return out;
};

const rcBaseMobsTick=mobsTick;
let rcWildSpawnT=0;
mobsTick=function(dt){
  rcBaseMobsTick(dt);
  rcWildSpawnT-=dt;
  if(rcWildSpawnT>0||DIM!=='over'||!P||P.dead||P.mode==='c'||!GR.mobSpawn)return;
  rcWildSpawnT=7.5;
  const [hostile,passive]=countMobs();
  if(hostile+passive>=22)return;
  const a=mobAnchor();
  const ang=Math.random()*Math.PI*2,dist=17+Math.random()*15;
  const x=Math.floor(a.x+Math.cos(ang)*dist),z=Math.floor(a.z+Math.sin(ang)*dist);
  if(!chunkAt(x,z)||!mobClearOfPlayers(x,z))return;
  const ci=colInfo(x,z);
  if(ci.b===BIOME.MEADOW||ci.b===BIOME.AUTUMN||ci.b===BIOME.REDWOOD||ci.b===BIOME.FOREST){
    const sy=surfaceTop(x,z);
    if((getBlock(x,sy,z)===B.GRASS||getBlock(x,sy,z)===B.SNOWGRASS)&&
       getBlock(x,sy+1,z)===B.AIR&&getBlock(x,sy+2,z)===B.AIR&&passive<10&&Math.random()<.72)
      spawnMob('deer',x+.5,sy+1,z+.5);
  }
  /* Cave mites prefer unlit underground pockets and become aggressive at night. */
  if(P.y<SEA-5&&hostile<12){
    const sy=Math.floor(P.y);
    if(!skyOpen(x,sy,z)&&!torchNear(x,sy,z)&&getBlock(x,sy,z)===B.AIR&&
       getBlock(x,sy+1,z)===B.AIR&&solidAt(x,sy-1,z)&&Math.random()<.5)
      spawnMob('cave_mite',x+.5,sy,z+.5);
  }
};

/* The deer inherit the normal flee-on-hit response; cave mites inherit the
   normal chase/attack state machine and night gating from the spider family. */
const rcBaseUpdateEntities=updateEntities;
let rcAmbientT=0;
updateEntities=function(dt){
  rcBaseUpdateEntities(dt);
  rcAmbientT-=dt;
  let rcChestWork=0;
  for(let i=0;i<RC_CHEST_PENDING.length&&rcChestWork<1;){
    const q=RC_CHEST_PENDING[i];
    if(q[4]!==SEED){RC_CHEST_PENDING.splice(i,1);RC_CHEST_QUEUED.delete(q[3]);continue;}
    if(!chunkAt(q[0],q[2])){i++;continue;}
    RC_CHEST_PENDING.splice(i,1);RC_CHEST_QUEUED.delete(q[3]);rcChestWork++;
    if(getBlock(q[0],q[1],q[2])===B.CHEST&&typeof lootFill==='function')lootFill(q[0],q[1],q[2],false);
  }
  if(rcAmbientT>0||!P||P.dead||!playing||DIM!=='over'||P.y<1)return;
  rcAmbientT=3.8;
  const x=Math.floor(P.x),y=Math.floor(P.y),z=Math.floor(P.z);
  if(y>surfaceTop(x,z)+3)return;
  const b=colInfo(x,z).b;
  if(b===BIOME.AUTUMN){
    burstParticles(P.x+(Math.random()-.5)*7,P.y+2.2,P.z+(Math.random()-.5)*7,B.LEAF_O,2,.35);
  }else if(b===BIOME.MARSH){
    burstParticles(P.x+(Math.random()-.5)*5,P.y+.15,P.z+(Math.random()-.5)*5,B.WATER,2,.18);
  }else if(b===BIOME.HIGHLANDS&&sunUp()){
    burstParticles(P.x+(Math.random()-.5)*6,P.y+2.5,P.z+(Math.random()-.5)*6,B.SNOWGRASS,2,.3);
  }
};

/* Public, read-only test seams. */
function rcBiomeStats(){
  const out={};
  for(let b=0;b<BIOME_NAME.length;b++)out[BIOME_NAME[b]||String(b)]=b;
  return out;
}
