export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { SquareClient, SquareEnvironment } = await import('square');
    const { randomUUID } = await import('crypto');

    const client = new SquareClient({
      token: process.env.SQUARE_ACCESS_TOKEN,
      environment: SquareEnvironment.Production,
    });

    const {
      packageName,
      packagePrice,
      eventDate,
      guestCount,
      eventType,
      addOns: selectedAddOns,
      wantsCatering,
      contact,
      total,
    } = req.body;

    if (!packageName || !packagePrice || !eventDate || !contact?.name || !contact?.phone || !contact?.email) {
      return res.status(400).json({ error: 'Missing required booking information' });
    }

    // 50% deposit
    const depositAmount = Math.round(total / 2);

    const lineItems = [
      {
        name: `Venue Rental: ${packageName} (50% Deposit)`,
        quantity: '1',
        basePriceMoney: {
          amount: BigInt(Math.round(packagePrice / 2 * 100)),
          currency: 'USD',
        },
      },
    ];

    // Add selected add-ons to line items (50% of each)
    if (selectedAddOns && selectedAddOns.length > 0) {
      const addOnDefs = [
        { id: 'hosted-bar-2hr', name: 'Open Bar (2 hours)', price: 15, unit: '/person' },
        { id: 'hosted-bar-4hr', name: 'Open Bar (4 hours)', price: 25, unit: '/person' },
        { id: 'extended-hours', name: 'Extended Hours', price: 200, unit: '/hour' },
        { id: 'dj-mc', name: 'DJ / MC Services', price: 300, unit: 'flat' },
        { id: 'custom-lighting', name: 'Custom Lighting Package', price: 200, unit: 'flat' },
        { id: 'coordinator', name: 'Day-Of Coordinator', price: 350, unit: 'flat' },
      ];

      for (const addonId of selectedAddOns) {
        const addon = addOnDefs.find(a => a.id === addonId);
        if (!addon) continue;

        let addonTotal = addon.price;
        if (addon.unit === '/person' && guestCount) {
          addonTotal = addon.price * guestCount;
        }
        const halfAddon = Math.round(addonTotal / 2 * 100);

        lineItems.push({
          name: `${addon.name} (50% Deposit)`,
          quantity: '1',
          basePriceMoney: {
            amount: BigInt(halfAddon),
            currency: 'USD',
          },
        });
      }
    }

    // Format phone to E.164
    const formatPhone = (phone) => {
      const digits = phone.replace(/\D/g, '');
      if (digits.length === 10) return `+1${digits}`;
      if (digits.length === 11 && digits[0] === '1') return `+${digits}`;
      return null;
    };

    const note = [
      `Event: ${eventType}`,
      `Date: ${eventDate}`,
      `Guests: ${guestCount}`,
      `Contact: ${contact.name}`,
      `Phone: ${contact.phone}`,
      `Email: ${contact.email}`,
      wantsCatering ? 'Catering: YES (J Rodgers BBQ)' : 'Catering: No',
      contact.message ? `Notes: ${contact.message}` : null,
    ].filter(Boolean).join(' | ');

    const response = await client.checkout.paymentLinks.create({
      idempotencyKey: randomUUID(),
      order: {
        locationId: process.env.SQUARE_LOCATION_ID,
        lineItems,
        metadata: {
          booking_type: 'venue_rental',
          package_name: packageName,
          event_date: eventDate,
          guest_count: String(guestCount),
          event_type: eventType,
          customer_name: contact.name,
          customer_phone: contact.phone,
          customer_email: contact.email,
          wants_catering: wantsCatering ? 'yes' : 'no',
          add_ons: (selectedAddOns || []).join(','),
        },
      },
      checkoutOptions: {
        redirectUrl: `${process.env.SITE_URL || 'https://rg158ent.com'}/booking-confirmation`,
        askForShippingAddress: false,
        merchantSupportEmail: 'info@rg158ent.com',
        note,
      },
      description: `RG 158 Venue Rental — ${packageName} — ${eventDate}`,
      prePopulatedData: {
        buyerEmail: contact.email || undefined,
        buyerPhoneNumber: formatPhone(contact.phone) || undefined,
      },
    });

    const paymentLink = response.paymentLink;

    if (!paymentLink?.url) {
      console.error('Square response missing URL:', JSON.stringify(response, (_, v) => typeof v === 'bigint' ? v.toString() : v));
      return res.status(500).json({
        error: 'No checkout URL returned. Please call us at (251) 217-2273.',
      });
    }

    return res.status(200).json({
      checkoutUrl: paymentLink.url,
      orderId: paymentLink.orderId,
    });
  } catch (error) {
    console.error('Square venue checkout error:', error?.message || error);
    return res.status(500).json({
      error: 'Failed to create checkout. Please try again or call us at (251) 217-2273.',
    });
  }
}
