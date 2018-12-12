#!/bin/sh
exec ffmpeg -f alsa -i default -c:a mp3 -map 0 -flags -global_header -f hls -hls_flags delete_segments+temp_file -hls_segment_filename www/stream/stream.%03d.ts www/stream/stream.m3u8 >log/ffmpeg.out
