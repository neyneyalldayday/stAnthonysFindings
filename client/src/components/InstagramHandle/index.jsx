import { TiSocialInstagram } from "react-icons/ti";
import './handle.css'

export const InstagramHandle = ({ stAnt }) => {
    return(
        <a href={`https://instagram.com/${ stAnt }`} target="_blank" rel="noopener noreferrer" className="handle" ><TiSocialInstagram size={60} /></a>
    )
}