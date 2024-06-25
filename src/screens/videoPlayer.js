import React, { useCallback, seRef, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, TouchableOpacity, Image ,Dimensions, View, Text } from 'react-native';
import Video from 'react-native-video';
import RNFS from 'react-native-fs';

const { width: screenWidth } = Dimensions.get('window');

// default cache download directory
const CACHE_DIRECTORY = `${RNFS.CachesDirectoryPath}/downloads`;


const CachedVideoPlayer = ({ media, index, isLoggedIn, user_type }) => {

    const [videoPath, setVideoPath] = useState(media.media_file);
    const [isCached, setIsCached] = useState(false);

    const videoUrl = media.media_file;
    const videoName = videoUrl.split('/').slice(-1)[0];

    /**
     * | check if the current filename is already stored in cache
     * @param {uri} fileName 
     * @returns 
     */
    const fileExistsInCache = async (fileName) => {
        const fileExists = await RNFS.exists(`${CACHE_DIRECTORY}/${fileName}`);
        return fileExists;
    };

    /**
     * if the current file is already in cache, use it instead of the internet loading
     * 
     * note: this actually has a fallback. if a new media file is placed with the same name... it won't consider it i guess
     */
    const updateMedia = useCallback (function () {

        const check = async () => {
            const isFileInCache = await fileExistsInCache(videoName);
            if (isFileInCache) {
                setIsCached(true);
                //console.log('File already exists in cache.');
                setVideoPath(`${CACHE_DIRECTORY}/${videoName}`);
            }
        }
        check();
      
        // update whenever the session status is changed
    }, [isLoggedIn]);
    useFocusEffect(updateMedia);

    async function download() {

        // Function to download a file and store it in the cache
        const downloadAndStoreFile = async (url, fileName) => {
            
            const isFileInCache = await fileExistsInCache(fileName);
          
            if (isFileInCache) {
              //console.log('File already exists in cache.');
              setVideoPath(`${CACHE_DIRECTORY}/${fileName}`);
              return;
            }

            try {
                // Create the cache directory if it doesn't exist
                await RNFS.mkdir(CACHE_DIRECTORY);
          
                // Download the file
                const downloadOptions = {
                  fromUrl: url,
                  toFile: `${CACHE_DIRECTORY}/${fileName}`,
                };
          
                const downloadResult = await RNFS.downloadFile(downloadOptions).promise;
          
            if (downloadResult.statusCode === 200) {
                
                Alert.alert('File downloaded');
                //console.log('File downloaded and stored in cache successfully.');
                setVideoPath(`${CACHE_DIRECTORY}/${fileName}`);
            } else {
              console.log('Failed to download file.');
            }
            } catch (error) {
              console.log('Error occurred while downloading the file:', error);
            }
          }

          downloadAndStoreFile(videoUrl, videoName);
    }

  return (
        (isLoggedIn && videoPath && media.media_type === "V")? (
            <View>
            <Video 
                source={{ uri: videoPath }}
                resizeMode = { 'center' }
                style={{ width: screenWidth, flex: 1 }}
                paused={true}
                controls={ (isLoggedIn && user_type === "Premium") ? true : false}
                playInBackground={false}
            />
            <TouchableOpacity
                onPress = {() => {if (!isCached) download();}}
            >
                <Text style = {{color:'black', padding: 2, alignSelf:'center'}} >Download</Text>
            </TouchableOpacity>
            </View>
      ) : (isLoggedIn && videoPath ? (
        <View>
            <Video 
                source={{ uri: videoPath }}
                resizeMode = { 'center' }
                style={{ width: screenWidth, flex: 1 }}
                paused={true}
                controls={(isLoggedIn && user_type === "Premium") ? true : false}
                audioOnly = {true}
                playInBackground={false}
            />
            <TouchableOpacity
                onPress = {() => {if (!isCached) download();}}
            >
                <Text style = {{color:'black', padding: 2, alignSelf:'center'}}>Download</Text>
            </TouchableOpacity>
    </View>) :
        <View></View>

    ))};

export default CachedVideoPlayer;