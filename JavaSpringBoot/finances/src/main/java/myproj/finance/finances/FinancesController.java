package myproj.finance.finances;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Date;
import java.sql.Timestamp;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/finances")
public class FinancesController {

    @Autowired
    private FinanceRepository financeRepository;

    //Insert
    @PostMapping("/add")
    public Finance addTransaction(@RequestBody Finance finance) {
        System.out.println("Received userId: " + finance.getUserId());
    System.out.println("Received amount: " + finance.getAmount());
    
    // Set the timestamp
    finance.setTimestamp(new Timestamp(new Date().getTime()));
    
    // Save the finance entry
    return financeRepository.save(finance);
    }

    //Read
    @GetMapping("/all")
    public List<Finance> getAllTransactions() {
        return financeRepository.findAllByOrderByTimestampDesc();
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
                finance.setTimestamp(new Timestamp(new Date().getTime()));
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

    //Sort
    @GetMapping("/user/{userId}")
    public List<Finance> getTransactionsByUserId(@PathVariable Long userId) {
        return financeRepository.findByUserIdOrderByTimestampDesc(userId);
    }
    

    @GetMapping("/")
    public String home(){
        return "Home";
    }

}
