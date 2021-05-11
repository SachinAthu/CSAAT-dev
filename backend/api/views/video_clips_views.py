from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
from moviepy.editor import *
import shutil
import os

from api.models import VideoClips, Videos
from api.serializers import VideoClipsSerializer

# get all video clips
@api_view(['GET'])
def allVideoClips(request):
    video_clip_list = VideoClips.objects.all().order_by('-id')
    serializer = VideoClipsSerializer(video_clip_list, many=True)
    return Response(serializer.data)


# get the video clip for a video
@api_view(['GET'])
def videoClip(request, pk):
    video_clip = VideoClips.objects.filter(video_id=pk)
    serializer = VideoClipsSerializer(video_clip, many=True)
    return Response(serializer.data)


# get one video clip
@api_view(['GET'])
def singleVideoClip(request, pk):
    video_clip = VideoClips.objects.get(id=pk)
    serializer = VideoClipsSerializer(video_clip, many=False)
    return Response(serializer.data)


# add one video clip
@api_view(['POST'])
def addVideoClip(request):
    print(request.data)
    video = Videos.objects.get(id=request.data['video_id'])

    try:
        clip = VideoFileClip(video.video.path).subclip(request.data['start_time'], request.data['end_time'])
        clip_name = str(video.id) + video.file_extension
        clip_path = f'{settings.MEDIA_ROOT}/sliced_videos/{clip_name}'
        clip.write_videofile(clip_path)

        data = {
            'video_id': request.data['video_id'],
            'name': clip_name,
            'video': f'/sliced_videos/{clip_name}',
            'duration': request.data['end_time'] - request.data['start_time'],
            'file_type': video.file_type,
            'file_extension': video.file_extension
        }
        serializer = VideoClipsSerializer(data=data)
        if serializer.is_valid():
            # delete previous record
            video_clips = VideoClips.objects.filter(video_id=request.data['video_id'])
            if video_clips.__len__() >= 1:
                for v in video_clips:
                    v.delete()
          
            serializer.save()
        else:
            print(serializer.errors)

        return Response({'msg': 'Successed!'}, status = 200)
    except:
        return Response({'msg': 'Failed!'}, status = 500)


# delete a video clip
@api_view(['DELETE'])
def deleteVideoClip(request, pk):
    video_clip = VideoClips.objects.get(id=pk)
    video_clip.delete()

    # delete video file
    try:
        path = f'{settings.MEDIA_ROOT}{video_clip.video}'
        os.remove(path)
    except:
        print('video file deletion error')

    return Response('Video clip was deleted')


# delete all video clips
@api_view(['DELETE'])
def deleteVideoClips(request):
    VideoClips.objects.all().delete()

    return Response('All Video clips were deleted')