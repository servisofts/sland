import Component.Mesh;
import Component.Notificacion;
import Component.Scene;
import Component.SceneMesh;
import Servisofts.SConsole;
import org.json.JSONObject;
import Server.SSSAbstract.SSSessionAbstract;

public class Manejador {
    public static void onMessage(JSONObject obj, SSSessionAbstract session) {
        if (session != null) {
            SConsole.log(session.getIdSession(), "\t|\t", obj.getString("component"), obj.getString("type"));
        }
        if (obj.isNull("component")) {
            return;
        }
        switch (obj.getString("component")) {
            case Notificacion.COMPONENT:
                Notificacion.onMessage(obj, session);
                break;
            case Scene.COMPONENT:
                Scene.onMessage(obj, session);
                break;
            case Mesh.COMPONENT:
                Mesh.onMessage(obj, session);
                break;
            case SceneMesh.COMPONENT:
                SceneMesh.onMessage(obj, session);
                break;
        }
    }
}
