package altisource.rulesmanagement.tools;

import com.google.code.morphia.Morphia;
import com.mongodb.Mongo;

import java.net.UnknownHostException;

/**
 * Created with IntelliJ IDEA.
 * User: Richard Gu
 * Date: 6/24/13
 * Time: 4:12 PM
 */


public class MorphiaFactory {

    private String host;
    private int port;

    public Mongo getMongoInstance() throws UnknownHostException {
        Mongo mongo = new Mongo(host, port);
        return mongo;
    }

    public Morphia getMorphiaInstance() {
        Morphia morphia = new Morphia();
        return morphia;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public void setPort(String port) {
        this.port = Integer.parseInt(port);
    }


}
