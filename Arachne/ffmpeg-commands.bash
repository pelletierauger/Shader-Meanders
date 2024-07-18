

ffmpeg -i /Users/guillaumepelletier/Desktop/Arachne.mov \
-filter_complex "[0:v]minterpolate=fps=120.0,tblend=all_mode=average,framestep=2[out]" -map "[out]" \
/Users/guillaumepelletier/Desktop/Arachne-mblur.mov