import { db } from '#/database/db';
import { Loan } from '#/models/loan';
import { LOAN_STATUS } from '#/util/constants';

export class LoanService {
  async getAllLoans(): Promise<Loan[] | null> {
    const result = await db.query('SELECT * FROM loans ORDER BY applicantName ASC');
    if (result.rowCount === 0) return null;

    return result.rows;
  }

  async getLoanById(id: string): Promise<Loan | null> {
    const result = await db.query('SELECT * FROM loans WHERE id = $1', [id]);
    if (result.rowCount === 0) return null;

    return result.rows[0];
  }

  async createLoan(applicantName: string, requestedAmount: number): Promise<Loan> {
    const now = new Date();
    const result = await db.query(
      `
      INSERT INTO loans (applicantName, requestedAmount, status, createdAt, updatedAt)
      VALUES ($1, $2, $3, $4, $4)
      RETURNING *;
    `,
      [applicantName, requestedAmount, LOAN_STATUS.PENDING, now]
    );

    return result.rows[0];
  }

  async updateLoan(id: string, updates: Partial<Pick<Loan, 'applicantName' | 'requestedAmount' | 'status'>>): Promise<Loan | null> {
    if (!updates || Object.keys(updates).length === 0) {
      console.error('Update payload cannot be empty');
      return null;
    }

    // check if the loan exists
    const existingLoan = await this.getLoanById(id);
    if (!existingLoan) {
      console.error(`Loan with id ${id} not found`);
      return null;
    }

    const setClauses: string[] = [];
    const values: (string | number | Date)[] = [];
    let paramIndex = 1;

    if (updates.applicantName) {
      setClauses.push(`applicantName = $${paramIndex++}`);
      values.push(updates.applicantName);
    }

    if (updates.requestedAmount) {
      setClauses.push(`requestedAmount = $${paramIndex++}`);
      values.push(updates.requestedAmount);
    }

    if (updates.status) {
      setClauses.push(`status = $${paramIndex++}`);
      values.push(updates.status);
    }

    values.push(id);
    const query = `
      UPDATE loans
      SET ${setClauses.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *;
    `;

    const result = await db.query(query, values);
    return result.rows[0];
  }

  async rejectLoan(id: string): Promise<Loan | null> {
    const loan = await this.getLoanById(id);
    if (!loan) {
      console.error(`Loan with id ${id} not found`);
      return null;
    }
    const query = `
      UPDATE loans
      SET status = $1, updatedAt = $2
      WHERE id = $3
      RETURNING *;
    `;
    const values = [LOAN_STATUS.REJECTED, new Date(), id];
    const result = await db.query(query, values);
    if (result.rowCount === 0) {
      console.error(`Loan with id ${id} not updated`);
      return null;
    }
    return result.rows[0];
  }

  async deleteLoan(id: string): Promise<boolean> {
    const result = await db.query('DELETE FROM loans WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return false;
    }

    return true;
  }
}
