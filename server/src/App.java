import Servisofts.Servisofts;

public class App {
    public static void main(String[] args) {
        try {
            Servisofts.ManejadorCliente = ManejadorCliente::onMessage;
            Servisofts.Manejador = Manejador::onMessage;
            Servisofts.initialize();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}