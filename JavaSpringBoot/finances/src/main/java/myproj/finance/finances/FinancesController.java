package myproj.finance.finances;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/finances")
public class FinancesController {

    @Autowired
    private FinanceRepository financeRepository;

    //Insert
    @PostMapping("/add")
    public Finance addTransaction(@RequestBody Finance finance) {
        finance.setUserId(1L);
        return financeRepository.save(finance);
    }

    //Read
    @GetMapping("/all")
    public List<Finance> getAllTransactions() {
        return financeRepository.findByUserId(1L);
    }

    //Update
    @PutMapping("/update/{id}")
    public Finance updateTransaction(@PathVariable Long id, @RequestBody Finance updatedFinance) {
        return financeRepository.findById(id)
            .map(finance -> {
                finance.setAmount(updatedFinance.getAmount());
                finance.setCategory(updatedFinance.getCategory());
                finance.setLocation(updatedFinance.getLocation());
                finance.setNotes(updatedFinance.getNotes());
                finance.setTimestamp(updatedFinance.getTimestamp());
                finance.setVendor(updatedFinance.getVendor());
                return financeRepository.save(finance);
            })
            .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id " + id));
    }

    //Delete
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteTransaction(@PathVariable Long id) {
        return financeRepository.findById(id)
            .map(finance -> {
                financeRepository.delete(finance);
                return ResponseEntity.ok().build();
            })
            .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id " + id));
            
    }

    @GetMapping("/")
    public String home(){
        return "Home";
    }

}
