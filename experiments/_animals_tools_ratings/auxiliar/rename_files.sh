# !/bin/bash
# gives files sensible names
indir="`pwd`/boss_screened"
outdir="`pwd`/objects"
fn='object'

mkdir $outdir
idx=1
for ii in `ls $indir`;do
  cp $indir/$ii $outdir/$fn$idx'.jpg'
  ((idx++))
done



# some other useful snippets:
#
# for f in *.png; do mv -- "$f" "${f%.png}.jpg"; done
#
#
# for i in $( ls | grep [A-Z] ); do mv -i $i `echo $i | tr 'A-Z' 'a-z'`; done
#
#
# for f in *.png*; do echo mv \"$f\" \"${f//'_rs_'/''}\"; done | /bin/bash
