package altisource.rulesmanagement.service.utils;

import org.codehaus.jackson.JsonGenerator;
import org.codehaus.jackson.JsonProcessingException;
import org.codehaus.jackson.map.JsonSerializer;
import org.codehaus.jackson.map.SerializerProvider;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: Richard Gu
 * Date: 6/25/13
 * Time: 10:46 AM
 */


public class DataSerializer extends JsonSerializer<Date> {

    @Override
    public void serialize(Date value_p, JsonGenerator gen, SerializerProvider prov_p)
            throws IOException, JsonProcessingException
    {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
        String formattedDate = formatter.format(value_p);
        gen.writeString(formattedDate);
    }

}
