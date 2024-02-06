import type { QuotationItemDto } from './quotationItem/quotationItem';

type amount = number;
type amountMxn = number;
type unitPrice = number;
type unitPriceMxn = number;
type increment = number;
type Amounts = [amount, amountMxn, unitPrice, unitPriceMxn, increment];
export function calculateAmounts(
  item: QuotationItemDto,
  dollar: number | string
): Amounts {
  const qty = Number(item.quantity);
  const increment = item.increment ? Number(item.increment) / 100 : 0;

  const unitPriceDlls = Number(item.unitPrice);
  let amountDlls = qty * unitPriceDlls;
  const incrementDlls = amountDlls * increment;
  amountDlls += incrementDlls;

  const unitPriceMxn = unitPriceDlls * Number(dollar || 1);
  let amountMxn = qty * unitPriceMxn;
  const incrementMxn = amountMxn * increment;
  amountMxn += incrementMxn;

  return [amountDlls, amountMxn, unitPriceDlls, unitPriceMxn, increment];
}

type subtotal = number;
type iva = number;
type total = number;
type subtotalMxn = number;
type ivaMxn = number;
type totalMxn = number;
type Totals = [subtotal, iva, total, subtotalMxn, ivaMxn, totalMxn];
export function calculateGrandTotals(
  items: QuotationItemDto[] = [],
  dollar: number | string
): Totals {
  const subtotalDlls = items.reduce((prev, current) => {
    const [amountDlls] = calculateAmounts(current, dollar);
    return prev + amountDlls;
  }, 0);
  const ivaDlls = subtotalDlls * 0.16;
  const totalDlls = subtotalDlls + ivaDlls;

  const subtotalMxn = subtotalDlls * Number(dollar || 1);
  const ivaMxn = subtotalMxn * 0.16;
  const totalMxn = subtotalMxn + ivaMxn;
  return [subtotalDlls, ivaDlls, totalDlls, subtotalMxn, ivaMxn, totalMxn];
}
