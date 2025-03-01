import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text, ActivityIndicator, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { onValue, ref, set } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import StackAppbar from '../../components/StackAppBar';
import { colors } from '../../utils/colors';
import { database } from '../../utils/firebaseConfig';

const Notifications = ({ user , color }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const userId = user?.id || user?._id;

  const readNotifications = (currentNotifs) => {
    currentNotifs.forEach((item) => {
      const dataRef = ref(database, 'notifications/' + userId + '/' + item.id + '/read');
      set(dataRef, true);
    });
  };

  useEffect(() => {
    if (user) {
      const notificationsRef = ref(database, 'notifications/' + userId);

      onValue(notificationsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const dataArray = Object.entries(data).map(([key, value]) => ({
            ...value,
            id: key,
          }));
          setNotifications(dataArray.reverse());
        }
        setLoading(false); // Stop loading once data is fetched
      }); 
    }
  }, [user]);

  useEffect(() => {
    if (notifications.length > 0) {
      readNotifications(notifications);
    }
  }, [notifications]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={color} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
       <StackAppbar title='Notifications' color={color}/>
      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="notifications-none" size={80} color={colors.gray} />
          <Text style={styles.emptyText}>Vous n'avez aucune notification</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NotificationItem color={color} notification={item} />}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

// NotificationItem inclus dans le même fichier
const NotificationItem = ({ notification , color}) => {
  const { title, message, timestamp, icon } = notification;

  // Formatage de la date
  const formattedDate = new Date(timestamp).toLocaleString();

  return (
    <View style={styles.notificationContainer}>
      <View style={styles.iconContainer}>
        {icon ? (
          <Image source={{ uri: icon }} style={styles.icon} />
        ) : (
          <MaterialIcons name="notifications" size={40} color={color} />
        )}
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title || 'Notification'}</Text>
        <Text style={styles.message} numberOfLines={2}>{message || 'Vous avez une nouvelle notification.'}</Text>
        <Text style={styles.timestamp}>{formattedDate}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 20,
    fontSize: 18,
    fontFamily: 'montserrat-bold',
    color: '#ccc'
  },
  listContent: {
    padding: 10,
  },
  // Styles pour NotificationItem
  notificationContainer: {
    flexDirection: 'row',
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2, // ombre sur Android
    shadowColor: '#000', // ombre sur iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 10,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: 'montserrat-bold',
    marginBottom: 5,
  },
  message: {
    fontSize: 14,
  },
  timestamp: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 5,
    fontFamily: 'montserrat-regular',
  },
});

export default Notifications;
