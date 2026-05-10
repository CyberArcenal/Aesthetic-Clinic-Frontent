import React, { useState, useEffect } from "react";
import { FileText, Eye } from "lucide-react";
import { authStore } from "../../../stores/authStore";
import billingApi from "../../../api/core/billing";
import type { InvoiceResponseDto } from "../../../api/core/billing";
import { formatCurrency } from "../../../utils/formatters";
import { dialogs } from "../../../utils/dialogs";

const ClientInvoices: React.FC = () => {
  const [invoices, setInvoices] = useState<InvoiceResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const user = authStore.getUser();

  useEffect(() => {
    const fetch = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const res = await billingApi.getInvoicesByClient(user.id);
        if (res.success) setInvoices(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user?.id]);

  const handleViewDetails = (invoice: InvoiceResponseDto) => {
    dialogs.alert({
      title: `Invoice #${invoice.invoiceNumber}`,
      message: `
        Issue Date: ${new Date(invoice.issueDate).toLocaleDateString()}
        Due Date: ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}
        Subtotal: ${formatCurrency(invoice.subtotal)}
        Tax: ${formatCurrency(invoice.tax)}
        Total: ${formatCurrency(invoice.total)}
        Amount Paid: ${formatCurrency(invoice.amountPaid)}
        Balance Due: ${formatCurrency(invoice.balanceDue)}
        Status: ${invoice.status || 'Pending'}
        Notes: ${invoice.notes || 'None'}
      `,
    });
  };

  if (loading) return <div className="text-center py-12">Loading invoices...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">My Invoices</h1>
        <p className="text-gray-500">Track your payments and billing history.</p>
      </div>

      {invoices.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-500">No invoices found.</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {invoices.map(inv => (
                <tr key={inv.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{inv.invoiceNumber || inv.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(inv.issueDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{formatCurrency(inv.total)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${inv.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {inv.status || 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleViewDetails(inv)} className="text-[var(--primary-color)] hover:underline flex items-center gap-1 ml-auto">
                      <Eye size={16} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClientInvoices;