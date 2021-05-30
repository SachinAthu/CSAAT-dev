from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
from moviepy.editor import *
import os
import platform

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
    # create sliced_videos folder if it is not
    def create_sliced_videos_d(path):
        if not os.path.exists(path):
            os.mkdir(path)

    print(request.data)

    video = Videos.objects.get(id=request.data['video_id'])
    clip_name = ''
    clip_file_name = ''
    child_type = ''
    video_save = ''
    
    if not video.tChild == None:
        child_type = 'typical'
        child = video.tChild
        clip_name = f'{child.unique_no}_{child.sequence_no}_{video.id}'
        clip_file_name = f'{child.unique_no}_{child.sequence_no}_{video.id}{video.file_extension}'
        video_save = f'/sliced_videos/typical/{clip_file_name}'
    else:
        child_type = 'atypical'
        child = video.atChild
        clip_name = f'{child.clinic_no}_{video.id}'
        clip_file_name = f'{child.clinic_no}_{video.id}{video.file_extension}'
        video_save = f'/sliced_videos/atypical/{clip_file_name}'

    clip_path = ''
    if platform.system().lower() == 'linux' or platform.system().lower() == 'Darwin' or platform.system().lower() == 'Mac':
        clip_path = f'{settings.MEDIA_ROOT}/sliced_videos/{child_type}/{clip_file_name}'
        create_sliced_videos_d(f'{settings.MEDIA_ROOT}/sliced_videos/typical')
        create_sliced_videos_d(f'{settings.MEDIA_ROOT}/sliced_videos/atypical')
    elif platform.system().lower() == 'windows':
        clip_path = f'{settings.MEDIA_ROOT}\\sliced_videos\\{child_type}\\{clip_file_name}'
        create_sliced_videos_d(f'{settings.MEDIA_ROOT}\\sliced_videos\\typical')
        create_sliced_videos_d(f'{settings.MEDIA_ROOT}\\sliced_videos\\atypical')
    else:
        return Response({'msg': 'Unsupported operating system!'}, status = 500)

    try:
        clip = VideoFileClip(video.video.path).subclip(request.data['start_time'], request.data['end_time'])
        clip.write_videofile(clip_path)
    except:
        return Response({'msg': 'Video slicing failed!'}, status = 500)

    data = {
        'video_id': request.data['video_id'],
        'name': clip_name,
        'video': video_save,
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
        return Response({'msg': 'Video sliced. But adding to database failed!'}, status = 500)

    return Response({'msg': 'Successed!'}, status = 200)


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
        return Response({'msg': 'Video file deleting failed!'}, status = 500)

    return Response('Video clip was deleted')


# delete all video clips
@api_view(['DELETE'])
def deleteVideoClips(request):
    video_clips = VideoClips.objects.all().delete()

    try:
        for v in video_clips:
            path = f'{settings.MEDIA_ROOT}{v.video}'
            os.remove(path)
    except:
        print('video files deletion error')
        return Response({'msg': 'Video files deleting failed!'}, status = 500)

    return Response('All Video clips were deleted')