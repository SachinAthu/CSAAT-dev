from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
import shutil
import os
from django.conf import settings
from django.core.files.storage import default_storage
from rest_framework.pagination import PageNumberPagination
from rest_framework import filters
from rest_framework import generics

from api.models import Videos, Sessions, Cameras, CameraAngles, TypicalChild, AntypicalChild
from api.serializers import VideosSerializer


# get all videos for typical children
@api_view(['GET'])
def allTVideos(request):
    paginator = PageNumberPagination()
    paginator.page_size = 20

    video_list = Videos.objects.all().exclude(tChild__isnull=True).order_by('-id')
    result_page = paginator.paginate_queryset(video_list, request)
    serializer = VideosSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)

# get all videos of antypical children
@api_view(['GET'])
def allATVideos(request):
    paginator = PageNumberPagination()
    paginator.page_size = 20

    video_list = Videos.objects.all().exclude(atChild__isnull=True).order_by('-id')
    result_page = paginator.paginate_queryset(video_list, request)
    serializer = VideosSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)


# get all videos of a session
@api_view(['GET'])
def sessionVideos(request, pk):
    session = Sessions.objects.get(id=pk)
    video_list = Videos.objects.filter(session__exact=session)
    serializer = VideosSerializer(video_list, many=True)
    return Response(serializer.data)


# get all sliced videos of typical children
@api_view(['GET'])
def allTSlicedVideos(request):
    paginator = PageNumberPagination()
    paginator.page_size = 20

    video_list = Videos.objects.filter(sliced__exact=True).exclude(tChild__isnull=True).order_by('-id')
    result_page = paginator.paginate_queryset(video_list, request)
    serializer = VideosSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)

# get all sliced videos of atypical children
@api_view(['GET'])
def allATSlicedVideos(request):
    paginator = PageNumberPagination()
    paginator.page_size = 20

    video_list = Videos.objects.filter(sliced__exact=True).exclude(atChild__isnull=True).order_by('-id')
    result_page = paginator.paginate_queryset(video_list, request)
    serializer = VideosSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)


# get all unsliced videos of typical children
@api_view(['GET'])
def allTUnslicedVideos(request):
    paginator = PageNumberPagination()
    paginator.page_size = 20

    video_list = Videos.objects.filter(sliced__exact=False).exclude(tChild__isnull=True).order_by('-id')
    result_page = paginator.paginate_queryset(video_list, request)
    serializer = VideosSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)

# get all unsliced videos of typical children
@api_view(['GET'])
def allATUnslicedVideos(request):
    paginator = PageNumberPagination()
    paginator.page_size = 20

    video_list = Videos.objects.filter(sliced__exact=False).exclude(atChild__isnull=True).order_by('-id')
    result_page = paginator.paginate_queryset(video_list, request)
    serializer = VideosSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)


# filter values in all videos of typical children
class AllTVideosListAPIView(generics.ListAPIView):
    queryset = Videos.objects.all().exclude(tChild__isnull=True).order_by('-id')
    serializer_class = VideosSerializer

    filter_backends = [filters.SearchFilter]
    search_fields = ['camera_name', 'camera_angle_name', 'session__date', 'tChild__name', 'tChild__unique_no', 'tChild__sequence_no', 'atChild__name', 'atChild__clinic_no']

# filter values in sliced videos of typical children
class SlicedTVideosListAPIView(generics.ListAPIView):
    queryset = Videos.objects.filter(sliced__exact=True).exclude(tChild__isnull=True).order_by('-id')
    serializer_class = VideosSerializer

    filter_backends = [filters.SearchFilter]
    search_fields = ['camera_name', 'camera_angle_name', 'session__date', 'tChild__name', 'tChild__unique_no', 'tChild__sequence_no', 'atChild__name', 'atChild__clinic_no']

# filter values in unsliced videos of typical children
class UnslicedTVideosListAPIView(generics.ListAPIView):
    queryset = Videos.objects.filter(sliced__exact=False).exclude(tChild__isnull=True).order_by('-id')
    serializer_class = VideosSerializer

    filter_backends = [filters.SearchFilter]
    search_fields = ['camera_name', 'camera_angle_name', 'session__date', 'tChild__name', 'tChild__unique_no', 'tChild__sequence_no', 'atChild__name', 'atChild__clinic_no']

# filter values in all videos of atypical children
class AllATVideosListAPIView(generics.ListAPIView):
    queryset = Videos.objects.all().exclude(atChild__isnull=True).order_by('-id')
    serializer_class = VideosSerializer

    filter_backends = [filters.SearchFilter]
    search_fields = ['camera_name', 'camera_angle_name', 'session__date', 'tChild__name', 'tChild__unique_no', 'tChild__sequence_no', 'atChild__name', 'atChild__clinic_no']

# filter values in sliced videos of atypical children
class SlicedATVideosListAPIView(generics.ListAPIView):
    queryset = Videos.objects.filter(sliced__exact=True).exclude(atChild__isnull=True).order_by('-id')
    serializer_class = VideosSerializer

    filter_backends = [filters.SearchFilter]
    search_fields = ['camera_name', 'camera_angle_name', 'session__date', 'tChild__name', 'tChild__unique_no', 'tChild__sequence_no', 'atChild__name', 'atChild__clinic_no']

# filter values in unsliced videos of atypical children
class UnslicedATVideosListAPIView(generics.ListAPIView):
    queryset = Videos.objects.filter(sliced__exact=False).exclude(atChild__isnull=True).order_by('-id')
    serializer_class = VideosSerializer

    filter_backends = [filters.SearchFilter]
    search_fields = ['camera_name', 'camera_angle_name', 'session__date', 'tChild__name', 'tChild__unique_no', 'tChild__sequence_no', 'atChild__name', 'atChild__clinic_no']


# get single video
@api_view(['GET'])
def getVideo(request, pk):
    video = Videos.objects.get(id=pk)
    serializer = VideosSerializer(video, many=False)
    return Response(serializer.data)


# get single video details
@api_view(['GET'])
def getVideoInfo(request, pk):
    video = Videos.objects.get(id=pk)

    # get child
    child = None
    if not video.tChild == None:
        child = TypicalChild.objects.get(id=video.tChild.id)
    else:
        child = AntypicalChild.objects.get(id=video.atChild.id)
    
    # get session
    session = Sessions.objects.get(id=video.session.id)

    res = {
        'child_name': child.name,
        'session_date': session.date,
        'camera': video.camera_name,
        'camera_angle': video.camera_angle_name,
        'duration': video.duration,
        'file_type': video.file_type,
        'file_extension': video.file_extension
    }

    if not video.tChild == None:
        res['child_unique_no'] = child.unique_no
        res['child_sequence_no'] = child.sequence_no
    else:
        res['child_clinic_no'] = child.clinic_no
    
    return Response(res)

    

# add typical child video
@api_view(['POST'])
def addTVideo(request):
    serializer = VideosSerializer(data=request.data)

    if serializer.is_valid():
        # set video name
        camera = Cameras.objects.get(id=request.data['camera'])
        camera_angle = CameraAngles.objects.get(id=request.data['camera_angle'])
        child = TypicalChild.objects.get(id=request.data['tChild'])
        session = Sessions.objects.get(id=request.data['session'])

        name = f'{child.unique_no}_{session.id}_{camera.name}'
        
        #set file extension
        file_type = request.data['file_type']
        file_extension = ''
        if not file_type == None: 
            t = file_type.split('/')[1]
            if t == 'mp4':
                file_extension = '.mp4'
            elif t == 'x-matroska':
                file_extension = '.mkv'
            else:
                file_extension = '.mp4'

        serializer.save(name=name, camera_name=camera.name, camera_angle_name=camera_angle.name, file_extension=file_extension)
    else:
        print(serializer.errors)

    return Response(serializer.data)


# add antypical child video
@api_view(['POST'])
def addATVideo(request):
    print(request.data)
    serializer = VideosSerializer(data=request.data)

    if serializer.is_valid():
        # set video name
        camera = Cameras.objects.get(id=request.data['camera'])
        camera_angle = CameraAngles.objects.get(id=request.data['camera_angle'])
        child = AntypicalChild.objects.get(id=request.data['atChild'])
        session = Sessions.objects.get(id=request.data['session'])

        name = f'{child.clinic_no}_{session.id}_{camera.name}'
        
        #set file extension
        file_type = request.data['file_type']
        file_extension = ''
        if not file_type == None: 
            t = file_type.split('/')[1]
            if t == 'mp4':
                file_extension = '.mp4'
            elif t == 'x-matroska':
                file_extension = '.mkv'
            else:
                file_extension = '.mp4'

        serializer.save(name=name, camera_name=camera.name, camera_angle_name=camera_angle.name, file_extension=file_extension)
    else:
        print(serializer.errors)

    return Response(serializer.data)


# update video
@api_view(['PUT'])
def updateVideo(request, pk):
    print(request.data)
    video = Videos.objects.get(id=pk)
    serializer = VideosSerializer(data=request.data, instance=video)

    if serializer.is_valid():
        serializer.save()
    else:
        print(serializer.errors)

    return Response(serializer.data)


# delete a video
@api_view(['DELETE'])
def deleteVideo(request, pk):
    video = Videos.objects.get(id=pk)
    res = ''

    try:
        video.delete()
        res += 'video record was deleted. '
        if video.video:
            if default_storage.exists(video.video.path):
                default_storage.delete(video.video.path)
                res += 'video file was deleted. '
        if video.thumbnail:
            if default_storage.exists(video.thumbnail.path):
                default_storage.delete(video.thumbnail.path)
                res += 'video thumbnail was deleted. '
    except:
        res = 'error, something went wrong!'

    return Response(res)


# delete all videos
@api_view(['DELETE'])
def deleteVideos(request):
    videos = Videos.objects.all()
    res = ''
    
    try:
        for v in videos:
            v.delete()
            if v.video:
                if default_storage.exists(v.video.path):
                    default_storage.delete(v.video.path)
            if video.thumbnail:
                if default_storage.exists(v.thumbnail.path):
                    default_storage.delete(v.thumbnail.path)
        res = 'all Videos were deleted(records, video files, thumbnails)'
    except:
        res = 'error, something went wrong!'

    return Response(res)