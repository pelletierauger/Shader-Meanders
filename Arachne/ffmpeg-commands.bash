

ffmpeg -i /Users/guillaumepelletier/Desktop/Arachne.mov \
-filter_complex "[0:v]minterpolate=fps=120.0,tblend=all_mode=average,framestep=2[out]" -map "[out]" \
/Users/guillaumepelletier/Desktop/Arachne-mblur.mov


ffmpeg -ss 00:01:00 -to 00:02:00 -i /Users/guillaumepelletier/Desktop/Arachne-2.mov \
-c copy output.mp4


ffmpeg -ss 00:00:00 -to 00:02:00 -i /Users/guillaumepelletier/Desktop/Arachne-2.mov \
-ss 00:00:23 -to 00:03:00 -i /Users/guillaumepelletier/Desktop/Arachne-Loin.mov \
-filter_complex "[0:v] [0:a] [1:v] [1:a] \
concat=n=2:v=1:a=1 [v] [a]" \
-map "[v]" -map "[a]" /Users/guillaumepelletier/Desktop/Arachne-Montage.mov


ffmpeg -i /Users/guillaumepelletier/Desktop/Arachne-2.mov \
-i /Users/guillaumepelletier/Desktop/Arachne-Loin.mov \
-filter_complex \
"[0:v]scale=2176:1224,trim=start=0:end=120,setpts=PTS-STARTPTS[v0]; \
 [0:a]atrim=start=0:end=120,asetpts=PTS-STARTPTS[a0]; \
 [1:v]scale=2176:1224,trim=start=24:end=180,setpts=PTS-STARTPTS[v1]; \
 [1:a]atrim=start=24:end=180,asetpts=PTS-STARTPTS[a1]; \
 [v0][a0][v1][a1]concat=unsafe=1:n=2:v=1:a=1[v][a]" \
-map "[v]" -map "[a]" \
-s 2176x1224 \
/Users/guillaumepelletier/Desktop/Arachne-Montage.mov