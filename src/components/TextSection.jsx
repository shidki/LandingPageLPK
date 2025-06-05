import { Float, Line, OrbitControls, PerspectiveCamera, Text, useScroll } from "@react-three/drei";
export const TextSection = ({title, subtitle, ...props}) => {
    return (
    <>
    <group {...props}>
        { !!title && (
            <Text 
                font="./fonts/DMSerifDisplay-Regular.ttf" 
                color="white" 
                anchorX={"left"} 
                anchorY="bottom" 
                fontSize={0.52} 
                maxWidth={2.5} >
            {{ title }}
            </Text>
        )}
        <Text 
                font="./fonts/DMSerifDisplay-Regular.ttf" 
                color="white" 
                anchorX={"left"} 
                anchorY="top" 
                fontSize={0.22} 
                maxWidth={2.5} >
            {{ subtitle }}
            </Text>
    </group>
    </>
    )
}