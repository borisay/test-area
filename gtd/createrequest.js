/**
 * Created by borisayupov on 1/8/15.
 */
/* Check browser type and create ajax request object */
function createRequest(){
    var ajaxRequest;

    try{
// Opera 8.0+, Firefox, Safari
        ajaxRequest = new XMLHttpRequest(); // Create the object
    }
    catch (e){
// IE Browsers
        try{
            ajaxRequest = new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch (e) {
            try{
                ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
            }
            catch (e){
                alert("Cannot create an XMLHTTP instance");
                return false;
            }
        }
    }
    return ajaxRequest;
}
