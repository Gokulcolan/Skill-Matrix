export const handleSesssionStorage = (action, key, value) => {
    switch (action) {
      case "add":
        sessionStorage.setItem(key, value);
        break;
      case "get":
        return sessionStorage.getItem(key);
      case "remove":
        sessionStorage.removeItem(key);
        break;
      default:
        console.error("Invalid action provided");
    }
  };
  