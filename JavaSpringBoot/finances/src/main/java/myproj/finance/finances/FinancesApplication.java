package myproj.finance.finances;

//import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.context.WebServerApplicationContext;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class FinancesApplication {

    public static void main(String[] args) {
        
        ConfigurableApplicationContext context = SpringApplication.run(FinancesApplication.class, args);
        System.out.println("test code");
        if (context instanceof WebServerApplicationContext) {
            int port = ((WebServerApplicationContext) context).getWebServer().getPort();
            System.out.println("Application is running on port: " + port);
        } else {
            System.out.println("Web server not available.");
    }

    
}
}

