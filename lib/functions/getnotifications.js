import { onValue, ref } from "firebase/database"

import * as Notifications from 'expo-notifications';
import { database } from "../../utils/firebaseConfig";

export async function displayPushNotification(notification) {

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: notification.title ?? 'EASY-LIFE',
        body: notification.message ?? 'Notification EASY-LIFE',
        data: notification.data ?? {},
      },
      trigger: null, // notification immédiate
    });
  } catch (error) {
    console.error('Failed to display push notification:', error);
  }
}


export function getnotifications(user , setNotifications) {
 const notificationsRef = ref(database, 'notifications/'+user.id)

    onValue(notificationsRef , (sn)=>{
      const data = sn.val()
      if (data) {
        const dataArray = Object.entries(data).map(([key , value])=>({
          ...value,
          id: key
        }))
        const filtered = dataArray.filter(item=>(item.read===undefined||item.read===false))
        console.log(data)
        filtered.forEach((item)=>{
          displayPushNotification(item)
        })

       
        setNotifications(filtered)
      }
    })}

