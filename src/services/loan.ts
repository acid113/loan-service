import { Loan } from '#/models/loan';

export class LoanService {
  private loans: Loan[] = [];

  getAllLoans(): Loan[] {
    return this.loans;
  }

  getLoanById(id: string): Loan | undefined {
    return this.loans.find((loan) => loan.id === id);
  }

  createLoan(applicantName: string, requestedAmount: number): Loan {
    const loan: Loan = {
      id: crypto.randomUUID(),
      applicantName,
      requestedAmount,
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.loans.push(loan);
    return loan;
  }

  updateLoan(applicantName = null, status: null, requestedAmount?: number): Loan {
    const loan: Loan = {
      id: crypto.randomUUID(),
      applicantName: applicantName ?? 'Applicant',
      requestedAmount: requestedAmount ?? 0,
      status: status ?? 'PENDING',
      updatedAt: new Date(),
    };

    this.loans.push(loan);
    return loan;
  }

  deleteLoan(id: string): boolean {
    const index = this.loans.findIndex((loan) => loan.id === id);
    if (index !== -1) {
      this.loans.splice(index, 1);
      return true;
    }
    return false;
  }
}
