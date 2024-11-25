import "./addUser.css";
import { useState } from "react";
import { db } from "../../../../lib/firebase";
import { collection, doc, getDocs, query, where, setDoc, updateDoc, serverTimestamp, arrayUnion } from "firebase/firestore";
import { useUserStore } from "../../../../lib/userStore";

const AddUser = () => {
  const [user, setUser] = useState(null);
  const { currentUser } = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        setUser({ id: userDoc.id, ...userDoc.data() });
        console.log("User found:", { id: userDoc.id, ...userDoc.data() });
      } else {
        console.log("No user found.");
        setUser(null);
      }
    } catch (error) {
      console.error("Error searching user:", error);
    }
  };

  const handleAdd = async () => {
    if (!user) {
      console.error("No user selected.");
      return;
    }

    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");

    try {
      const newChatRef = doc(chatRef);

      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      const userChatDocRef = doc(userChatsRef, user.id);
      const currentUserChatDocRef = doc(userChatsRef, currentUser.id);

      // Ensure documents exist
      await setDoc(userChatDocRef, { chats: [] }, { merge: true });
      await setDoc(currentUserChatDocRef, { chats: [] }, { merge: true });

      // Update chats
      await updateDoc(userChatDocRef, {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });

      await updateDoc(currentUserChatDocRef, {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),
        }),
      });

      console.log("Chat added successfully!");
    } catch (error) {
      console.error("Error adding chat:", error);
    }
  };

  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Username" name="username" />
        <button type="submit">Search</button>
      </form>
      {user && (
        <div className="user">
          <div className="detail">
            <img src={user.avatar || "./avatar.png"} alt="Avatar" />
            <span>{user.username}</span>
          </div>
          <button onClick={handleAdd}>Add User</button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
