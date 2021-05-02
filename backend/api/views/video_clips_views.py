from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response

from api.models import VideoClips, Videos
from api.serializers import VideoClipsSerializer

# get all video clips
@api_view(['GET'])
def allVideoClips(request, videoID):
    video_clip_list = VideoClips.objects.all().order_by('-id')
    serializer = VideoClipsSerializer(video_clip_list, many=True)
    return Response(serializer.data)


# get all video clips for a video
@api_view(['GET'])
def videoClips(request, videoID):
    video_clip_list = VideoClips.objects.filter(video_id_exact=videoID)
    serializer = VideoClipsSerializer(video_clip_list, many=True)
    return Response(serializer.data)


# get one video clip
@api_view(['GET'])
def videoClip(request, pk):
    video_clip = VideoClips.objects.filter(id=pk)
    serializer = VideoClipsSerializer(video_clip, many=False)
    return Response(serializer.data)


# add one video clip
@api_view(['POST'])
def addVideoClip(request, pk):
    video = Videos.objects.filter(id=pk)
    serializer = VideoClipsSerializer(data=request.data)

    if serializer.is_valid():

        # slice the video here

        serializer.save()

    return Response(serializer.data)


# delete a video clip
@api_view(['DELETE'])
def deleteVideoClip(request, pk):
    video_clip = VideoClips.objects.get(id=pk)
    video_clip.delete()

    return Response('Video clip was deleted')


# delete all video clips
@api_view(['DELETE'])
def deleteVideoClips(request):
    VideoClips.objects.all().delete()

    return Response('All Video clips were deleted')