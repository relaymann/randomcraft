/* =====================================================================
 * RANDOMCRAFT 1.1 — Building and decoration set
 * Appended block ids; existing block and save ids are not reassigned.
 * ===================================================================== */
B.RC_MOSS_BRICK=99;
B.RC_LANTERN=100;
B.RC_SLATE=101;
B.RC_DARK_PLANK=102;
B.RC_PLANTER=103;

def(B.RC_MOSS_BRICK,{name:'Mossy Stone Bricks',tiles:'rc_mossbrick',hard:1.8,toolClass:'pick',req:true});
def(B.RC_LANTERN,{name:'Trail Lantern',tiles:'rc_lantern',hard:.4,solid:false,opq:false,
  bucket:'cut',cross:true,light:true,drop:B.RC_LANTERN});
def(B.RC_SLATE,{name:'Polished Slate',tiles:'rc_slate',hard:2.2,toolClass:'pick',req:true});
def(B.RC_DARK_PLANK,{name:'Darkwood Planks',tiles:'rc_darkplank',hard:2,toolClass:'axe'});
def(B.RC_PLANTER,{name:'Wildflower Planter',tiles:'rc_planter',hard:.5,solid:false,opq:false,
  bucket:'cut',cross:true,drop:B.RC_PLANTER});
const rcBaseIsTorch=isTorch;
isTorch=function(id){return id===B.RC_LANTERN||rcBaseIsTorch(id);};

tile('rc_mossbrick',c=>{
  c.fillStyle='#65745c';c.fillRect(0,0,16,16);
  c.fillStyle='#8b9580';c.fillRect(1,1,6,6);c.fillRect(9,1,6,6);c.fillRect(1,9,6,6);c.fillRect(9,9,6,6);
  c.fillStyle='#3f4d40';c.fillRect(0,7,16,2);c.fillRect(7,0,2,16);
  c.fillStyle='#3f6b45';c.fillRect(2,2,3,2);c.fillRect(10,10,4,3);c.fillRect(11,2,2,2);
});
tile('rc_lantern',c=>{
  c.clearRect(0,0,16,16);c.fillStyle='#4a4030';c.fillRect(4,2,8,2);c.fillRect(5,12,6,2);
  c.fillRect(3,4,2,8);c.fillRect(11,4,2,8);c.fillStyle='#f6bd58';c.fillRect(5,4,6,8);
  c.fillStyle='#fff0b0';c.fillRect(7,5,2,6);c.fillStyle='#8b5a2b';c.fillRect(6,0,4,2);
});
tile('rc_slate',c=>{
  c.fillStyle='#59616b';c.fillRect(0,0,16,16);c.fillStyle='#78838e';
  c.fillRect(1,1,14,2);c.fillRect(1,8,14,2);c.fillRect(1,15,14,1);
  c.fillStyle='#414953';c.fillRect(0,4,16,2);c.fillRect(6,2,2,6);c.fillRect(11,10,2,5);
});
tile('rc_darkplank',c=>{
  c.fillStyle='#49372b';c.fillRect(0,0,16,16);c.fillStyle='#684b36';
  c.fillRect(1,1,14,4);c.fillRect(1,7,14,3);c.fillRect(1,12,14,3);
  c.fillStyle='#30251f';c.fillRect(0,5,16,1);c.fillRect(0,10,16,1);
  c.fillStyle='#9a7651';c.fillRect(3,2,1,2);c.fillRect(11,8,1,1);
});
tile('rc_planter',c=>{
  c.clearRect(0,0,16,16);c.fillStyle='#8a5936';c.fillRect(3,8,10,6);
  c.fillStyle='#b17a4b';c.fillRect(2,7,12,2);c.fillStyle='#443526';c.fillRect(4,10,8,3);
  c.fillStyle='#4b8b48';c.fillRect(7,3,2,5);c.fillRect(4,4,4,2);c.fillRect(9,2,3,3);
  c.fillStyle='#e6c66b';c.fillRect(4,3,2,2);c.fillStyle='#e5e0c5';c.fillRect(10,1,2,2);
});

R(['SSS','SFS','SSS'],{S:B.STONEBRICK,F:B.TALLGRASS},B.RC_MOSS_BRICK,8);
R([' I ','ITI',' I '],{I:IT.IRON,T:B.TORCH},B.RC_LANTERN,2);
R(['SSS','SSS'],{S:B.STONE},B.RC_SLATE,6);
R(['PPP','PPP'],{P:B.PLANK_S},B.RC_DARK_PLANK,6);
R([' F ','G G',' G '],{G:B.GRAVEL,F:B.FLOWER_R},B.RC_PLANTER,1);
