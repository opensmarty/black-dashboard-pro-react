import {GoogleApiWrapper} from 'google-maps-react';
 
// ...
 
export class MapContainer extends React.Component {}
 
export default GoogleApiWrapper({
  apiKey: ('AIzaSyDUzl8evAposmqeMkDLeWm_Q84UktbpAxk')
})(MapContainer)