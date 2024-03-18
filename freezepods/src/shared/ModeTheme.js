// ModeTheme.js
const ModeTheme = {
    getTheme: (gameId, modeId) => {
      switch (gameId) {
        case '1':
          // Theme logic for Game 1
          switch (modeId) {
            case 'light':
              return { backgroundColor: '#ffa', textColor: '#000' };
            case 'button':
              return { backgroundColor: '#4285f4', textColor: '#fff' };
            case 'connect':
              return { backgroundColor: '#00bcd4', textColor: '#fff' };
            default:
              return { backgroundColor: '#fff', textColor: '#000' };
          }

        default:
          return { backgroundColor: '#fff', textColor: '#000' };
      }
    },
  };
  
  export default ModeTheme;
  