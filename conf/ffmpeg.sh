#!/bin/sh
echo                     | tee -a log/ffmpeg.out log/ffmpeg.err >/dev/null
echo "=================" | tee -a log/ffmpeg.out log/ffmpeg.err >/dev/null
echo "Restarting FFmpeg" | tee -a log/ffmpeg.out log/ffmpeg.err >/dev/null
echo "=================" | tee -a log/ffmpeg.out log/ffmpeg.err >/dev/null
echo                     | tee -a log/ffmpeg.out log/ffmpeg.err >/dev/null
exec ffmpeg -f avfoundation -i :0 -c:a mp3 -map 0 -flags -global_header -f hls -hls_flags delete_segments+temp_file -hls_segment_filename www/stream/stream.%03d.ts www/stream/stream.m3u8 >>log/ffmpeg.out 2>>log/ffmpeg.err
