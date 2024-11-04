package myproj.finance.finances;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface FinanceRepository extends JpaRepository <Finance, Long>{
    List<Finance> findByUserId(Long userId);
}
