import { onValue, push, ref, set } from "firebase/database";
import { database } from "../../firebase/firebaseConfig"

export function sendNotifications(notification) {
    const allNotificationRef = ref(database, `notifications/${notification?.receiverId}`)

 return    push(allNotificationRef , notification)
}

