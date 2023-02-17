import { StatusBar } from 'react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold} from '@expo-google-fonts/inter'
import { Loading } from './src/components/Loading';
import { Routes } from './src/routers';
import './src/lib/dayjs'

export default function App() {

  const [fontsLoader] = useFonts({
    Inter_400Regular, 
    Inter_600SemiBold, 
    Inter_700Bold, 
    Inter_800ExtraBold
  })

  if (!fontsLoader) {
    return <Loading/>;
  }

  return (
    <>
      <Routes/>
      <StatusBar barStyle="light-content" backgroundColor='transparent' translucent/>
    </>
  );
}
