import React, { createContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState({});
  const [myitem , setMyitem] = useState(false);
  const [username, setUsername] = useState(null);
  const [userid, setUserid] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser, loading, setLoading, account, setAccount, contract, setContract, myitem , setMyitem, username, setUsername, userid, setUserid}}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
