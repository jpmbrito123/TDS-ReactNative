import { StyleSheet, Dimensions, Image, View, Text } from "react-native";
import FastImage from 'react-native-fast-image';
import CachedVideoPlayer from "../screens/videoPlayer";

const { width, height } = Dimensions.get('window');

const MediaProvider = ({ media, index, isLoggedIn, user_type }) => {

    const MediaImage = ({ media }) => {

        return isLoggedIn && user_type === 'Premium' ? 
        <FastImage 
                style={{
                    width: width,
                    height: 420,
                }} 
                source={{
                    uri: media.media_file,
                    priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.cover}
                cache={FastImage.cacheControl.immutable}
            />
            :
            (
                <View style={{
                    width: width,
                    height: 420,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#d3d3d3' // cor de fundo quando o usuário não está logado ou não é premium
                }}>
                    <Text style={{ color: 'black', fontSize: 18, textAlign: 'center' }}>
                        Log in as a premium user to view media
                    </Text>
                </View>
            )
    }
    
    {/* componente para áudio e vídeo */}
    const MediaVideo = ({ media, index }) => {
        return (
            <CachedVideoPlayer media={media} index={index} isLoggedIn={isLoggedIn} user_type={user_type} />
        );
    };

    return (
        media.media_type === 'I' ? 
            <MediaImage media={media} /> :
                <MediaVideo media={media} index={index} />
    );
}

const styles = StyleSheet.create({

})

export default MediaProvider;
