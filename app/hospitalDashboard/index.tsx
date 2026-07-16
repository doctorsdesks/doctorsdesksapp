import Icon from '@/components/Icons';
import Loader from '@/components/Loader';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {
    getAllNotifications,
    getHospitalDetails,
    getNotificationCount,
    getSecureKey
} from '@/components/Utils';
import { NotificationType } from '@/constants/Enums';
import { useAppContext } from '@/context/AppContext';
import { useEffect, useState } from 'react';
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    View
} from 'react-native';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme.web';


const DashboardCard = ({
    title,
    value,
    icon,
    iconColor,
    backgroundColor
}: any) => {
    return (
        <View
            style={[
                styles.card,
                {
                    backgroundColor
                }
            ]}
        >
            <View
                style={[
                    styles.iconContainer,
                    {
                        backgroundColor: `${iconColor}20`
                    }
                ]}
            >
                <Icon
                    type={icon}
                    fill={iconColor}
                />
            </View>
            <ThemedText style={styles.cardTitle}>
                {title}
            </ThemedText>
            <ThemedText
                style={[
                    styles.cardValue,
                    {
                        color: iconColor
                    }
                ]}
            >
                {value}
            </ThemedText>
        </View>
    )
}

const Home = () => {
    const {
        hospitalDetails,
        setHospitalDetails,
        notifications,
        setNotifications
    } = useAppContext();

    const [loader,setLoader] = useState(true);
    const [unReadNotificationCount,setUnReadNotificationCount] = useState(0);

    const colorScheme = useColorScheme() ?? 'light';

    useEffect(()=>{
        const loadHospital = async()=>{
            const id = await getSecureKey("hospitalId");
            if(id){
                fetchHospital(id);
                fetchNotifications(id);
            }
        }
        loadHospital();
    },[])

    useEffect(()=>{
        if(notifications?.length){
            setUnReadNotificationCount(
                getNotificationCount(notifications)
            )
        }
    },[notifications])

    const fetchHospital = async(id:string)=>{
        try{
            const response = await getHospitalDetails(id);
            if(response.status==="SUCCESS"){
                setHospitalDetails(response.data);
            }
            else{
                Toast.show({
                    type:"error",
                    text1:response.error
                })
            }
        }
        catch(error){
            Toast.show({
                type:"error",
                text1:"Unable to fetch hospital details"
            })
        }
        finally{
            setLoader(false);
        }
    }

    const fetchNotifications = async(id:string)=>{
        const response = await getAllNotifications(
            id,
            "ADMIN"
        );
        if(response.status==="SUCCESS"){
            const data:NotificationType[] =
            response.data.map((item:any)=>({
                id:item._id,
                title:item.title,
                body:item.body,
                image:item.image || "",
                metadata:item.metadata,
                isRead:item.isRead,
                icon:item.icon,
                category:item.category
            }));
            setNotifications(data);
        } else {
            Toast.show({
                type: 'error',
                text1: response.error,
                visibilityTime: 3000
            })
        }
    }

    if(loader)
        return <Loader/>;

    return (
        <ThemedView style={styles.container}>
            <View style={styles.topActionContainer}>
                <View></View>
                <Pressable
                    onPress={() => {
                        router.replace("/hospitalDashboard/notifications");
                    }}
                    style={styles.notificationBell}
                >
                    <Icon 
                        type="bell" 
                        fill={Colors[colorScheme].icon} 
                    />
                    {unReadNotificationCount !== 0 && (
                        <View style={styles.notificationCount} />
                    )}
                </Pressable>
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.banner}>
                    <View style={{flex:1}}>
                        <ThemedText style={styles.welcome}>
                            Welcome back,
                        </ThemedText>
                        <ThemedText style={styles.admin}>
                            {hospitalDetails?.ownerName}
                        </ThemedText>
                        <ThemedText style={styles.subText}>
                            Here's what's happening today.
                        </ThemedText>
                    </View>
                    <Image
                        source={
                            require("../../assets/images/hospital.png")
                        }
                        style={styles.hospitalImage}
                        resizeMode="contain"
                    />
                </View>
                <View style={styles.grid}>
                    <DashboardCard
                        title="Today's Total Appointments"
                        value={hospitalDetails?.totalAppointments ?? 0}
                        icon="appointment"
                        iconColor="#2563EB"
                        backgroundColor="#EFF6FF"
                    />
                    <DashboardCard
                        title="Completed Appointments"
                        value={hospitalDetails?.completedAppointments ?? 0}
                        icon="verified"
                        iconColor="#16A34A"
                        backgroundColor="#F0FDF4"
                    />
                    <DashboardCard
                        title="Pending Appointments"
                        value={hospitalDetails?.pendingAppointmentRequests ?? 0}
                        icon="clock"
                        iconColor="#F97316"
                        backgroundColor="#FFF7ED"
                    />
                    <DashboardCard
                        title="Total Doctors Onboarded"
                        value={hospitalDetails?.totalDoctors ?? 0}
                        icon="user"
                        iconColor="#7C3AED"
                        backgroundColor="#FAF5FF"
                    />
                    <DashboardCard
                        title="Doctor Join Requests"
                        value={hospitalDetails?.pendingDoctorRequests ?? 0}
                        icon="processing"
                        iconColor="#EAB308"
                        backgroundColor="#FEFCE8"
                    />
                </View>
            </ScrollView>
        </ThemedView>
    )
}

export default Home;

const styles = StyleSheet.create({
    container:{
        flex:1,
        paddingHorizontal:16,
        paddingTop:20
    },
    banner:{
        height:180,
        borderRadius:24,
        backgroundColor:"#E8F3FF",
        padding:20,
        flexDirection:"row",
        overflow:"hidden",
        alignItems:"center"
    },
    welcome:{
        fontSize:14,
        color:"#475569"
    },
    admin:{
        fontSize:28,
        lineHeight: 32,
        fontWeight:"700",
        color:"#123B7A",
        marginTop:4
    },
    subText:{
        marginTop:8,
        fontSize:12,
        color:"#64748B"
    },
    hospitalImage:{
        width:170,
        height:150
    },
    grid:{
        flexDirection:"row",
        flexWrap:"wrap",
        justifyContent:"space-between",
        marginTop:20
    },
    card:{
        width:"48%",
        height:170,
        borderRadius:20,
        padding:16,
        marginBottom:16
    },
    iconContainer:{
        width:50,
        height:50,
        borderRadius:16,
        alignItems:"center",
        justifyContent:"center"
    },
    cardTitle:{
        marginTop:16,
        fontSize:14,
        color:"#475569",
        lineHeight:20
    },
    cardValue:{
        marginTop:8,
        fontSize:34,
        lineHeight: 38,
        fontWeight:"700"
    },
    notificationBell: {
        position: "relative",
    },
    notificationCount: {
        position: "absolute",
        top: 2,
        right: 2,
        zIndex: 21,
        height: 8,
        width: 8,
        borderRadius: 8,
        backgroundColor: "#EB3639"
    },
    topActionContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    addDoctorButton: {
        height: 42,
        paddingHorizontal: 16,
        borderRadius: 14,
        backgroundColor: "#0c77ad",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#0c77ad",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    addDoctorText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        marginLeft: 8,
    },
});
