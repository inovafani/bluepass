export const whatsappTemplateNames = {
  bookingInquiryOperator: "booking_inquiry_operator",
  bookingQuoteTraveller: "booking_quote_traveller",
  bookingConfirmedTraveller: "booking_confirmed_traveller",
  paymentReminderTraveller: "payment_reminder_traveller",
} as const;

export type OperatorInquiryParams = {
  operatorName: string;
  tripTitle: string;
  travellerName: string;
  dateLabel: string;
  totalLabel: string;
};

export type TravellerQuoteParams = {
  travellerName: string;
  tripTitle: string;
  operatorName: string;
  totalLabel: string;
  conservationLabel: string;
};

export function buildOperatorInquiryParams(input: OperatorInquiryParams): string[] {
  return [
    input.operatorName,
    input.tripTitle,
    input.travellerName,
    input.dateLabel,
    input.totalLabel,
  ];
}

export function buildTravellerQuoteParams(input: TravellerQuoteParams): string[] {
  return [
    input.travellerName,
    input.tripTitle,
    input.operatorName,
    input.totalLabel,
    input.conservationLabel,
  ];
}
