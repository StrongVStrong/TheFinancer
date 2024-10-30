package myproj.finance.finances;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
public class FinancesController {

    @GetMapping("/")
    public String home(){
        return "Home";
    }



    @GetMapping("/finances")
    public String getFinances() {
        return "Hey";
    }
}
