import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TextInput,
    TouchableOpacity,
    FlatList,
    Keyboard,
    Image,
    ActivityIndicator,
    Alert,
  } from 'react-native';
  import React, { useEffect, useRef, useState } from 'react';
  import { Ionicons } from '@expo/vector-icons';
  import { Audio } from 'expo-av'; 
  import { useNavigation } from '@react-navigation/native';
  import { onValue, push, ref, set } from 'firebase/database';
  import { getArrayData } from '../../lib/functions/getArrayData';
  import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
  import { StatusBar } from 'expo-status-bar';
import { uploadPhotoService } from '../../lib/services/uploadPhotoSerrvice';
import { database, storage } from '../../utils/firebaseConfig';
  
  const ChatBox = ({ user , color }) => {
    const [newMessage, setNewMessage] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [messages, setMessages] = useState([]);
    const [sound, setSound] = useState();
    const [isRecording, setIsRecording] = useState(false);
    const [recordingUri, setRecordingUri] = useState(null);
    const [recording , setRecording] = useState(null)
    const listRef = useRef(null);
    const navigation = useNavigation();
    const receiver = {
      nom: 'Service client',
      userId: 'EXhz58FZNuULEdf8DXYNV9Nvghd2',
    };
  
    const messagesRef = ref(database, 'messages');
    const chatsRef1 = ref(database, 'chats/' + user.userId + '/' + receiver?.userId);
    const chatsRef2 = ref(database, 'chats/' + receiver.userId + '/' + user?.userId);
  
    useEffect(() => {
      onValue(messagesRef, (snapshots) => {
        const data = snapshots.val();
        if (data) {
          const array = getArrayData(data);
          const myMessages = array.filter((item) => {
            return (
              (item?.receiver?.userId === user.userId && item?.sender?.userId === receiver?.userId) ||
              (item?.sender?.userId === user.userId && item?.receiver?.userId === receiver?.userId)
            );
          });
          setMessages(myMessages);
        }
      });
    }, []);
  
    useEffect(() => {
      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 300);
    }, [messages]);
  
    const handleSendMessage = async () => {
      Keyboard.dismiss();
      if (newMessage.trim() === '' && !imageUrl && !recordingUri) return;
  
      setUploading(true);
  
      const message = {
        text: newMessage,
        receiver: receiver,
        sender: {
          ...user,
          articles: [],
          cart: [],
        },
        date: new Date().toISOString(),
        file: imageUrl,
        audio: recordingUri,
      };
  
      push(messagesRef, message);
      await set(chatsRef1, message);
      await set(chatsRef2, message);
  
      setNewMessage('');
      setImageUrl(null);
      setSelectedImage(null);
      setRecordingUri(null);
  
      setUploading(false);
    };
  
    const renderMessage = ({ item }) => {
      const isUserMessage = item.sender.userId === user.userId;
      return (
        <View
          style={[
            styles.messageContainer,
            isUserMessage ? {...styles.userMessageContainer, backgroundColor: color,
            } : styles.otherMessageContainer,
          ]}
        >
          {item.text !== '' && (
            <Text style={[styles.messageText, isUserMessage ? styles.userMessageText : null]}>
              {item.text}
            </Text>
          )}
          {item.file && (
            <Image source={{ uri: item.file }} style={{ width: 200, height: 200, margin: 10 }} />
          )}
          {item.audio && (
            <TouchableOpacity onPress={() => playSound(item.audio)}>
              <Ionicons name="play-circle-outline" size={30} color="gray" />
            </TouchableOpacity>
          )}
          <Text
            style={
              isUserMessage
                ? styles.timestamp
                : { color: 'white', fontSize: 12, opacity: 0.5 }
            }
          >
            {new Date(item.date).toLocaleTimeString()} -{' '}
            {isUserMessage ? 'Vous' : receiver.nom}
          </Text>
        </View>
      );
    };
  
    const playSound = async (uri) => {
      const { sound } = await Audio.Sound.createAsync({ uri });
      setSound(sound);
      await sound.playAsync();
    };
  
    const captureImage = async () => {
      try {
        const response = await uploadPhotoService.takePhoto(
          'library',
          'chat/' + user.userId + '/' + receiver?.userId,
          user.userId
        );
        setImageUrl(response.uploadResp?.downloadUrl);
        setSelectedImage(response.uploadResp?.downloadUrl);
      } catch (error) {
        Alert.alert('Erreur', 'Impossible de prendre la photo.');
      }
    };
  
    const startRecording = async () => {
      try {
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') {
          alert('Désolé, nous avons besoin de l\'accès au microphone.');
          return;
        }
  
      
        const recording = new Audio.Recording();
        await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        await recording.startAsync();
        setRecording(recording);
        setIsRecording(true);
      } catch (error) {
        console.error('Error starting recording:', error);
      }
    };
  
    const stopRecording = async () => {
      setIsRecording(false);
      try {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setRecordingUri(uri);
        setRecording(null);
  
      
      } catch (error) {
        console.error('Error stopping recording:', error);
      }
    };
  
    const uploadAudio = async (uri) => {
      try {
        const response = await fetch(uri);
        const blob = await response.blob();
        const filename = uri.split('/').pop();
        const storageRef = storageRef(storage, `audio/${filename}`);
  
        await uploadBytes(storageRef, blob);
        const url = await getDownloadURL(storageRef);
  
        return url;
      } catch (error) {
        console.error('Error uploading audio:', error);
      }
    };
  
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <StatusBar backgroundColor={color} style='light'/>
        <View style={[styles.header , {backgroundColor: color}]}>
          <TouchableOpacity onPress={navigation.goBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Image
            source={{ uri: 'https://via.placeholder.com/40' }}
            style={styles.profileImage}
          />
          <Text style={styles.headerTitle}>{receiver.nom}</Text>
        </View>
  
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={100}
        >
          <FlatList
            ref={listRef}
            ListFooterComponent={<View style={{ padding: 10 }} />}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
          />
  
          {uploading && (
            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}
            >
              <ActivityIndicator color="#fff" animating size="large" />
            </View>
          )}
        </KeyboardAvoidingView>
  
        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={captureImage}>
            <Ionicons name="camera-outline" size={24} color="gray" />
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Écrire un message"
            multiline={true}
          />
          <TouchableOpacity
            onPress={isRecording ? stopRecording : startRecording}
          >
            <Ionicons name={isRecording ? "stop-circle-outline" : "mic-outline"} size={24} color="gray" />
          </TouchableOpacity>
          {(newMessage.trim() !== '' || imageUrl || recordingUri) && (
            <TouchableOpacity onPress={handleSendMessage}>
              <Ionicons name="send-outline" size={24} color={color} />
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      marginTop: 30
    },
    profileImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginHorizontal: 10,
    },
    headerTitle: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
    messageContainer: {
      padding: 10,
      borderRadius: 10,
      marginVertical: 5,
      maxWidth: '80%',
      alignSelf: 'flex-start',
    },
    userMessageContainer: {
      alignSelf: 'flex-end',
    },
    otherMessageContainer: {
      backgroundColor: 'white',
      alignSelf: 'flex-start',
    },
    messageText: {
      color: 'white',
      fontSize: 16,
    },
    timestamp: {
      fontSize: 12,
      color: 'white',
      marginTop: 5,
      opacity: 0.7
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderTopWidth: 1,
      borderTopColor: 'white',
      backgroundColor: 'white',
    },
    textInput: {
      flex: 1,
      marginHorizontal: 10,
      borderRadius: 20,
      backgroundColor: '#f0f0f0',
      padding: 10,
      maxHeight: 100,
    },
  });
  
  export default ChatBox;
  