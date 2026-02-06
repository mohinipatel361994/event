import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Utensils, Bed, Package, DollarSign, Settings, BarChart3, Clock, Check, X, Plus, Edit2, Trash2, Eye, CreditCard } from 'lucide-react';

// Initial data
const initialHalls = [
	{ id: 1, name: 'Grand Ballroom', capacity: 500, pricePerDay: 5000, available: true, image: '🏛️' },
	{ id: 2, name: 'Garden Pavilion', capacity: 200, pricePerDay: 3000, available: true, image: '🌿' },
	{ id: 3, name: 'Rooftop Terrace', capacity: 150, pricePerDay: 2500, available: true, image: '🌆' },
	{ id: 4, name: 'Conference Hall', capacity: 100, pricePerDay: 2000, available: true, image: '🏢' },
];

const initialDecorations = [
	{ id: 1, name: 'Classic Elegance', price: 1500, description: 'Floral centerpieces, draping, elegant lighting', image: '💐' },
	{ id: 2, name: 'Modern Minimalist', price: 1200, description: 'Clean lines, geometric accents, ambient lighting', image: '✨' },
	{ id: 3, name: 'Rustic Charm', price: 1800, description: 'Wooden elements, fairy lights, natural decor', image: '🌾' },
	{ id: 4, name: 'Luxury Premium', price: 3000, description: 'Crystal chandeliers, premium fabrics, custom installations', image: '💎' },
];

const initialCatering = [
	{ id: 1, name: 'Continental Buffet', pricePerPerson: 45, description: 'International cuisine, 5-course meal', image: '🍽️' },
	{ id: 2, name: 'Indian Vegetarian', pricePerPerson: 35, description: 'Traditional vegetarian spread', image: '🥘' },
	{ id: 3, name: 'BBQ & Grill', pricePerPerson: 55, description: 'Live grilling station, premium meats', image: '🍖' },
	{ id: 4, name: 'Cocktail & Canapés', pricePerPerson: 40, description: 'Finger foods and beverages', image: '🍸' },
];

const initialRooms = [
	{ id: 1, type: 'Deluxe Room', pricePerNight: 150, available: 20, image: '🛏️' },
	{ id: 2, type: 'Suite', pricePerNight: 300, available: 10, image: '🏨' },
	{ id: 3, type: 'Presidential Suite', pricePerNight: 500, available: 3, image: '👑' },
];

const EventManagementApp = () => {
	const [currentView, setCurrentView] = useState('customer'); // 'customer' or 'admin'
	const [currentStep, setCurrentStep] = useState('booking'); // 'booking', 'calendar', 'payment', 'confirmation'
  
	// Inventory state (admin)
	const [halls, setHalls] = useState(initialHalls);
	const [decorations, setDecorations] = useState(initialDecorations);
	const [catering, setCatering] = useState(initialCatering);
	const [rooms, setRooms] = useState(initialRooms);
  
	// Booking state (customer)
	const [bookings, setBookings] = useState([]);
	const [currentBooking, setCurrentBooking] = useState({
		eventName: '',
		eventType: '',
		startDate: '',
		endDate: '',
		numberOfDays: 1,
		selectedHall: null,
		selectedDecoration: null,
		selectedCatering: null,
		guestCount: 0,
		selectedRooms: [],
		totalCost: 0,
		status: 'pending',
		customerName: '',
		customerEmail: '',
		customerPhone: '',
	});

	// Admin edit state
	const [editingItem, setEditingItem] = useState(null);
	const [adminSection, setAdminSection] = useState('halls'); // 'halls', 'decorations', 'catering', 'rooms', 'bookings'

	// Calculate total cost
	useEffect(() => {
		let total = 0;
    
		if (currentBooking.selectedHall) {
			total += currentBooking.selectedHall.pricePerDay * currentBooking.numberOfDays;
		}
    
		if (currentBooking.selectedDecoration) {
			total += currentBooking.selectedDecoration.price;
		}
    
		if (currentBooking.selectedCatering && currentBooking.guestCount > 0) {
			total += currentBooking.selectedCatering.pricePerPerson * currentBooking.guestCount;
		}
    
		currentBooking.selectedRooms.forEach(room => {
			total += room.pricePerNight * currentBooking.numberOfDays * room.quantity;
		});
    
		setCurrentBooking(prev => ({ ...prev, totalCost: total }));
	}, [currentBooking.selectedHall, currentBooking.selectedDecoration, currentBooking.selectedCatering, 
			currentBooking.guestCount, currentBooking.selectedRooms, currentBooking.numberOfDays]);

	// Calculate number of days
	useEffect(() => {
		if (currentBooking.startDate && currentBooking.endDate) {
			const start = new Date(currentBooking.startDate);
			const end = new Date(currentBooking.endDate);
			const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
			setCurrentBooking(prev => ({ ...prev, numberOfDays: days > 0 ? days : 1 }));
		}
	}, [currentBooking.startDate, currentBooking.endDate]);

	// Customer Booking Interface
	const BookingForm = () => (
		<div className="booking-form">
			<div className="form-section">
				<h2>Event Details</h2>
				<div className="form-grid">
					<div className="form-group">
						<label>Event Name</label>
						<input
							type="text"
							placeholder="Annual Conference 2024"
							value={currentBooking.eventName}
							onChange={(e) => setCurrentBooking({...currentBooking, eventName: e.target.value})}
						/>
					</div>
					<div className="form-group">
						<label>Event Type</label>
						<select
							value={currentBooking.eventType}
							onChange={(e) => setCurrentBooking({...currentBooking, eventType: e.target.value})}
						>
							<option value="">Select type</option>
							<option value="wedding">Wedding</option>
							<option value="conference">Conference</option>
							<option value="corporate">Corporate Event</option>
							<option value="birthday">Birthday Party</option>
							<option value="other">Other</option>
						</select>
					</div>
				</div>
			</div>

			<div className="form-section">
				<h2>Select Hall</h2>
				<div className="cards-grid">
					{halls.filter(h => h.available).map(hall => (
						<div
							key={hall.id}
							className={`card ${currentBooking.selectedHall?.id === hall.id ? 'selected' : ''}`}
							onClick={() => setCurrentBooking({...currentBooking, selectedHall: hall})}
						>
							<div className="card-icon">{hall.image}</div>
							<h3>{hall.name}</h3>
							<p className="capacity"><Users size={16} /> Capacity: {hall.capacity}</p>
							<p className="price">${hall.pricePerDay}/day</p>
							{currentBooking.selectedHall?.id === hall.id && (
								<div className="selected-badge">
									<Check size={16} /> Selected
								</div>
							)}
						</div>
					))}
				</div>
			</div>

			<div className="form-section">
				<h2>Event Duration</h2>
				<div className="form-grid">
					<div className="form-group">
						<label>Start Date</label>
						<input
							type="date"
							value={currentBooking.startDate}
							onChange={(e) => setCurrentBooking({...currentBooking, startDate: e.target.value})}
							min={new Date().toISOString().split('T')[0]}
						/>
					</div>
					<div className="form-group">
						<label>End Date</label>
						<input
							type="date"
							value={currentBooking.endDate}
							onChange={(e) => setCurrentBooking({...currentBooking, endDate: e.target.value})}
							min={currentBooking.startDate || new Date().toISOString().split('T')[0]}
						/>
					</div>
					<div className="form-group">
						<label>Number of Days</label>
						<input
							type="number"
							value={currentBooking.numberOfDays}
							readOnly
							className="readonly-input"
						/>
					</div>
				</div>
			</div>

			<div className="form-section">
				<h2>Decoration Package</h2>
				<div className="cards-grid">
					{decorations.map(deco => (
						<div
							key={deco.id}
							className={`card ${currentBooking.selectedDecoration?.id === deco.id ? 'selected' : ''}`}
							onClick={() => setCurrentBooking({...currentBooking, selectedDecoration: deco})}
						>
							<div className="card-icon">{deco.image}</div>
							<h3>{deco.name}</h3>
							<p className="description">{deco.description}</p>
							<p className="price">${deco.price}</p>
							{currentBooking.selectedDecoration?.id === deco.id && (
								<div className="selected-badge">
									<Check size={16} /> Selected
								</div>
							)}
						</div>
					))}
				</div>
			</div>

			<div className="form-section">
				<h2>Catering Services</h2>
				<div className="form-group">
					<label>Number of Guests</label>
					<input
						type="number"
						placeholder="Enter guest count"
						value={currentBooking.guestCount || ''}
						onChange={(e) => setCurrentBooking({...currentBooking, guestCount: parseInt(e.target.value) || 0})}
						min="0"
					/>
				</div>
				<div className="cards-grid">
					{catering.map(cat => (
						<div
							key={cat.id}
							className={`card ${currentBooking.selectedCatering?.id === cat.id ? 'selected' : ''}`}
							onClick={() => setCurrentBooking({...currentBooking, selectedCatering: cat})}
						>
							<div className="card-icon">{cat.image}</div>
							<h3>{cat.name}</h3>
							<p className="description">{cat.description}</p>
							<p className="price">${cat.pricePerPerson}/person</p>
							{currentBooking.guestCount > 0 && (
								<p className="subtotal">Total: ${cat.pricePerPerson * currentBooking.guestCount}</p>
							)}
							{currentBooking.selectedCatering?.id === cat.id && (
								<div className="selected-badge">
									<Check size={16} /> Selected
								</div>
							)}
						</div>
					))}
				</div>
			</div>

			<div className="form-section">
				<h2>Guest Rooms</h2>
				<div className="cards-grid">
					{rooms.map(room => {
						const selectedRoom = currentBooking.selectedRooms.find(r => r.id === room.id);
						return (
							<div key={room.id} className={`card ${selectedRoom ? 'selected' : ''}`}>
								<div className="card-icon">{room.image}</div>
								<h3>{room.type}</h3>
								<p className="capacity">Available: {room.available}</p>
								<p className="price">${room.pricePerNight}/night</p>
								<div className="room-selector">
									<button
										onClick={() => {
											const updated = currentBooking.selectedRooms.filter(r => r.id !== room.id);
											const current = selectedRoom?.quantity || 0;
											if (current > 0) {
												updated.push({...room, quantity: current - 1});
											}
											setCurrentBooking({...currentBooking, selectedRooms: updated.filter(r => r.quantity > 0)});
										}}
										disabled={!selectedRoom}
									>
										-
									</button>
									<span>{selectedRoom?.quantity || 0}</span>
									<button
										onClick={() => {
											const updated = currentBooking.selectedRooms.filter(r => r.id !== room.id);
											const current = selectedRoom?.quantity || 0;
											if (current < room.available) {
												updated.push({...room, quantity: current + 1});
											}
											setCurrentBooking({...currentBooking, selectedRooms: updated});
										}}
										disabled={selectedRoom?.quantity >= room.available}
									>
										+
									</button>
								</div>
								{selectedRoom && (
									<p className="subtotal">
										${selectedRoom.pricePerNight * currentBooking.numberOfDays * selectedRoom.quantity}
									</p>
								)}
							</div>
						);
					})}
				</div>
			</div>

			<div className="cost-summary">
				<h3>Total Cost</h3>
				<div className="cost-breakdown">
					{currentBooking.selectedHall && (
						<div className="cost-item">
							<span>Hall ({currentBooking.numberOfDays} days)</span>
							<span>${currentBooking.selectedHall.pricePerDay * currentBooking.numberOfDays}</span>
						</div>
					)}
					{currentBooking.selectedDecoration && (
						<div className="cost-item">
							<span>Decoration</span>
							<span>${currentBooking.selectedDecoration.price}</span>
						</div>
					)}
					{currentBooking.selectedCatering && currentBooking.guestCount > 0 && (
						<div className="cost-item">
							<span>Catering ({currentBooking.guestCount} guests)</span>
							<span>${currentBooking.selectedCatering.pricePerPerson * currentBooking.guestCount}</span>
						</div>
					)}
					{currentBooking.selectedRooms.map(room => (
						<div key={room.id} className="cost-item">
							<span>{room.type} × {room.quantity} ({currentBooking.numberOfDays} nights)</span>
							<span>${room.pricePerNight * currentBooking.numberOfDays * room.quantity}</span>
						</div>
					))}
					<div className="cost-total">
						<span>Total Amount</span>
						<span>${currentBooking.totalCost}</span>
					</div>
				</div>
			</div>

			<div className="form-actions">
				<button className="btn-secondary" onClick={() => setCurrentBooking({
					eventName: '', eventType: '', startDate: '', endDate: '', numberOfDays: 1,
					selectedHall: null, selectedDecoration: null, selectedCatering: null,
					guestCount: 0, selectedRooms: [], totalCost: 0, status: 'pending',
					customerName: '', customerEmail: '', customerPhone: ''
				})}>
					Reset
				</button>
				<button
					className="btn-primary"
					onClick={() => setCurrentStep('calendar')}
					disabled={!currentBooking.selectedHall || !currentBooking.startDate || !currentBooking.endDate}
				>
					Continue to Calendar View
				</button>
			</div>
		</div>
	);

	// Calendar View
	const CalendarView = () => {
		const generateCalendarDays = () => {
			const start = currentBooking.startDate ? new Date(currentBooking.startDate) : new Date();
			const end = currentBooking.endDate ? new Date(currentBooking.endDate) : new Date();
      
			const days = [];
			const currentDate = new Date(start);
      
			while (currentDate <= end) {
				days.push(new Date(currentDate));
				currentDate.setDate(currentDate.getDate() + 1);
			}
      
			return days;
		};

		const calendarDays = generateCalendarDays();

		return (
			<div className="calendar-view">
				<h2>Event Calendar Preview</h2>
				<div className="calendar-summary">
					<div className="summary-item">
						<Calendar size={20} />
						<div>
							<strong>{currentBooking.eventName || 'Your Event'}</strong>
							<p>{currentBooking.eventType}</p>
						</div>
					</div>
					<div className="summary-item">
						<Clock size={20} />
						<div>
							<strong>{currentBooking.numberOfDays} Days</strong>
							<p>{new Date(currentBooking.startDate).toLocaleDateString()} - {new Date(currentBooking.endDate).toLocaleDateString()}</p>
						</div>
					</div>
					<div className="summary-item">
						<MapPin size={20} />
						<div>
							<strong>{currentBooking.selectedHall?.name}</strong>
							<p>Venue</p>
						</div>
					</div>
				</div>

				<div className="calendar-grid">
					{calendarDays.map((day, index) => (
						<div key={index} className="calendar-day">
							<div className="day-header">
								<strong>Day {index + 1}</strong>
								<span>{day.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
							</div>
							<div className="day-events">
								<div className="event-item">
									<MapPin size={14} />
									<span>{currentBooking.selectedHall?.name}</span>
								</div>
								{currentBooking.selectedDecoration && index === 0 && (
									<div className="event-item">
										<Package size={14} />
										<span>{currentBooking.selectedDecoration.name}</span>
									</div>
								)}
								{currentBooking.selectedCatering && (
									<div className="event-item">
										<Utensils size={14} />
										<span>{currentBooking.selectedCatering.name}</span>
									</div>
								)}
								{currentBooking.selectedRooms.length > 0 && (
									<div className="event-item">
										<Bed size={14} />
										<span>{currentBooking.selectedRooms.reduce((sum, r) => sum + r.quantity, 0)} Rooms</span>
									</div>
								)}
							</div>
						</div>
					))}
				</div>

				<div className="form-actions">
					<button className="btn-secondary" onClick={() => setCurrentStep('booking')}>
						Back to Booking
					</button>
					<button className="btn-primary" onClick={() => setCurrentStep('payment')}>
						Proceed to Payment
					</button>
				</div>
			</div>
		);
	};

	// Payment Interface
	const PaymentInterface = () => {
		const [paymentMethod, setPaymentMethod] = useState('card');

		return (
			<div className="payment-interface">
				<h2>Payment Details</h2>
        
				<div className="payment-summary">
					<h3>Booking Summary</h3>
					<div className="summary-details">
						<p><strong>Event:</strong> {currentBooking.eventName}</p>
						<p><strong>Venue:</strong> {currentBooking.selectedHall?.name}</p>
						<p><strong>Duration:</strong> {currentBooking.numberOfDays} days</p>
						<p><strong>Dates:</strong> {new Date(currentBooking.startDate).toLocaleDateString()} - {new Date(currentBooking.endDate).toLocaleDateString()}</p>
						{currentBooking.selectedDecoration && <p><strong>Decoration:</strong> {currentBooking.selectedDecoration.name}</p>}
						{currentBooking.selectedCatering && <p><strong>Catering:</strong> {currentBooking.selectedCatering.name} for {currentBooking.guestCount} guests</p>}
						{currentBooking.selectedRooms.length > 0 && (
							<p><strong>Rooms:</strong> {currentBooking.selectedRooms.map(r => `${r.quantity} ${r.type}`).join(', ')}</p>
						)}
					</div>
					<div className="total-amount">
						<h3>Total Amount</h3>
						<p className="amount">${currentBooking.totalCost}</p>
					</div>
				</div>

				<div className="payment-form">
					<h3>Customer Information</h3>
					<div className="form-grid">
						<div className="form-group">
							<label>Full Name</label>
							<input
								type="text"
								placeholder="John Doe"
								value={currentBooking.customerName}
								onChange={(e) => setCurrentBooking({...currentBooking, customerName: e.target.value})}
							/>
						</div>
						<div className="form-group">
							<label>Email</label>
							<input
								type="email"
								placeholder="john@example.com"
								value={currentBooking.customerEmail}
								onChange={(e) => setCurrentBooking({...currentBooking, customerEmail: e.target.value})}
							/>
						</div>
						<div className="form-group">
							<label>Phone</label>
							<input
								type="tel"
								placeholder="+1 234 567 8900"
								value={currentBooking.customerPhone}
								onChange={(e) => setCurrentBooking({...currentBooking, customerPhone: e.target.value})}
							/>
						</div>
					</div>

					<h3>Payment Method</h3>
					<div className="payment-methods">
						<div
							className={`payment-method ${paymentMethod === 'card' ? 'selected' : ''}`}
							onClick={() => setPaymentMethod('card')}
						>
							<CreditCard size={24} />
							<span>Credit/Debit Card</span>
						</div>
						<div
							className={`payment-method ${paymentMethod === 'bank' ? 'selected' : ''}`}
							onClick={() => setPaymentMethod('bank')}
						>
							<DollarSign size={24} />
							<span>Bank Transfer</span>
						</div>
					</div>

					{paymentMethod === 'card' && (
						<div className="card-details">
							<div className="form-group">
								<label>Card Number</label>
								<input type="text" placeholder="1234 5678 9012 3456" maxLength="19" />
							</div>
							<div className="form-grid">
								<div className="form-group">
									<label>Expiry Date</label>
									<input type="text" placeholder="MM/YY" maxLength="5" />
								</div>
								<div className="form-group">
									<label>CVV</label>
									<input type="text" placeholder="123" maxLength="3" />
								</div>
							</div>
						</div>
					)}

					{paymentMethod === 'bank' && (
						<div className="bank-details">
							<p>Please transfer the amount to:</p>
							<div className="bank-info">
								<p><strong>Bank:</strong> Example Bank</p>
								<p><strong>Account Name:</strong> Event Management Co.</p>
								<p><strong>Account Number:</strong> 1234567890</p>
								<p><strong>Routing Number:</strong> 987654321</p>
							</div>
						</div>
					)}
				</div>

				<div className="form-actions">
					<button className="btn-secondary" onClick={() => setCurrentStep('calendar')}>
						Back to Calendar
					</button>
					<button
						className="btn-primary"
						onClick={() => {
							const newBooking = {
								...currentBooking,
								id: Date.now(),
								status: 'confirmed',
								bookingDate: new Date().toISOString(),
							};
							setBookings([...bookings, newBooking]);
							setCurrentStep('confirmation');
						}}
						disabled={!currentBooking.customerName || !currentBooking.customerEmail || !currentBooking.customerPhone}
					>
						Confirm Payment & Book
					</button>
				</div>
			</div>
		);
	};

	// Confirmation
	const Confirmation = () => {
		const latestBooking = bookings[bookings.length - 1];

		return (
			<div className="confirmation">
				<div className="success-icon">
					<Check size={48} />
				</div>
				<h2>Booking Confirmed!</h2>
				<p>Thank you for your booking. A confirmation email has been sent to {latestBooking?.customerEmail}</p>
        
				<div className="booking-reference">
					<h3>Booking Reference</h3>
					<p className="reference-number">#{latestBooking?.id}</p>
				</div>

				<div className="confirmation-details">
					<div className="detail-row">
						<span>Event Name:</span>
						<strong>{latestBooking?.eventName}</strong>
					</div>
					<div className="detail-row">
						<span>Venue:</span>
						<strong>{latestBooking?.selectedHall?.name}</strong>
					</div>
					<div className="detail-row">
						<span>Dates:</span>
						<strong>{new Date(latestBooking?.startDate).toLocaleDateString()} - {new Date(latestBooking?.endDate).toLocaleDateString()}</strong>
					</div>
					<div className="detail-row">
						<span>Total Amount:</span>
						<strong>${latestBooking?.totalCost}</strong>
					</div>
				</div>

				<div className="form-actions">
					<button className="btn-primary" onClick={() => {
						setCurrentStep('booking');
						setCurrentBooking({
							eventName: '', eventType: '', startDate: '', endDate: '', numberOfDays: 1,
							selectedHall: null, selectedDecoration: null, selectedCatering: null,
							guestCount: 0, selectedRooms: [], totalCost: 0, status: 'pending',
							customerName: '', customerEmail: '', customerPhone: ''
						});
					}}>
						Make Another Booking
					</button>
				</div>
			</div>
		);
	};

	// Admin Panel
	const AdminPanel = () => {
		const renderInventorySection = () => {
			const data = adminSection === 'halls' ? halls : 
										adminSection === 'decorations' ? decorations :
										adminSection === 'catering' ? catering : rooms;

			const setData = adminSection === 'halls' ? setHalls : 
											 adminSection === 'decorations' ? setDecorations :
											 adminSection === 'catering' ? setCatering : setRooms;

			return (
				<div className="inventory-section">
					<div className="section-header">
						<h3>{adminSection.charAt(0).toUpperCase() + adminSection.slice(1)}</h3>
						<button className="btn-add" onClick={() => setEditingItem({ new: true, type: adminSection })}>
							<Plus size={16} /> Add New
						</button>
					</div>

					<div className="inventory-table">
						<table>
							<thead>
								<tr>
									{adminSection === 'halls' && (
										<>
											<th>Name</th>
											<th>Capacity</th>
											<th>Price/Day</th>
											<th>Status</th>
											<th>Actions</th>
										</>
									)}
									{adminSection === 'decorations' && (
										<>
											<th>Name</th>
											<th>Description</th>
											<th>Price</th>
											<th>Actions</th>
										</>
									)}
									{adminSection === 'catering' && (
										<>
											<th>Name</th>
											<th>Description</th>
											<th>Price/Person</th>
											<th>Actions</th>
										</>
									)}
									{adminSection === 'rooms' && (
										<>
											<th>Type</th>
											<th>Price/Night</th>
											<th>Available</th>
											<th>Actions</th>
										</>
									)}
								</tr>
							</thead>
							<tbody>
								{data.map(item => (
									<tr key={item.id}>
										{adminSection === 'halls' && (
											<>
												<td>{item.name}</td>
												<td>{item.capacity}</td>
												<td>${item.pricePerDay}</td>
												<td>
													<span className={`status ${item.available ? 'available' : 'unavailable'}`}>
														{item.available ? 'Available' : 'Unavailable'}
													</span>
												</td>
											</>
										)}
										{adminSection === 'decorations' && (
											<>
												<td>{item.name}</td>
												<td>{item.description}</td>
												<td>${item.price}</td>
											</>
										)}
										{adminSection === 'catering' && (
											<>
												<td>{item.name}</td>
												<td>{item.description}</td>
												<td>${item.pricePerPerson}</td>
											</>
										)}
										{adminSection === 'rooms' && (
											<>
												<td>{item.type}</td>
												<td>${item.pricePerNight}</td>
												<td>{item.available}</td>
											</>
										)}
										<td>
											<div className="action-buttons">
												<button onClick={() => setEditingItem({ ...item, type: adminSection })}>
													<Edit2 size={14} />
												</button>
												<button onClick={() => {
													if (confirm('Are you sure you want to delete this item?')) {
														setData(data.filter(d => d.id !== item.id));
													}
												}}>
													<Trash2 size={14} />
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			);
		};

		const renderBookingsSection = () => (
			<div className="bookings-section">
				<h3>All Bookings</h3>
				<div className="bookings-table">
					<table>
						<thead>
							<tr>
								<th>ID</th>
								<th>Event Name</th>
								<th>Customer</th>
								<th>Venue</th>
								<th>Dates</th>
								<th>Total</th>
								<th>Status</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{bookings.map(booking => (
								<tr key={booking.id}>
									<td>#{booking.id}</td>
									<td>{booking.eventName}</td>
									<td>
										{booking.customerName}<br/>
										<small>{booking.customerEmail}</small>
									</td>
									<td>{booking.selectedHall?.name}</td>
									<td>
										{new Date(booking.startDate).toLocaleDateString()} -<br/>
										{new Date(booking.endDate).toLocaleDateString()}
									</td>
									<td>${booking.totalCost}</td>
									<td>
										<span className={`status ${booking.status}`}>
											{booking.status}
										</span>
									</td>
									<td>
										<button className="btn-icon">
											<Eye size={14} />
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		);

		return (
			<div className="admin-panel">
				<div className="admin-sidebar">
					<h3>Management</h3>
					<div className="admin-menu">
						<button
							className={adminSection === 'halls' ? 'active' : ''}
							onClick={() => setAdminSection('halls')}
						>
							<MapPin size={16} /> Halls
						</button>
						<button
							className={adminSection === 'decorations' ? 'active' : ''}
							onClick={() => setAdminSection('decorations')}
						>
							<Package size={16} /> Decorations
						</button>
						<button
							className={adminSection === 'catering' ? 'active' : ''}
							onClick={() => setAdminSection('catering')}
						>
							<Utensils size={16} /> Catering
						</button>
						<button
							className={adminSection === 'rooms' ? 'active' : ''}
							onClick={() => setAdminSection('rooms')}
						>
							<Bed size={16} /> Rooms
						</button>
						<button
							className={adminSection === 'bookings' ? 'active' : ''}
							onClick={() => setAdminSection('bookings')}
						>
							<BarChart3 size={16} /> Bookings
						</button>
					</div>
				</div>

				<div className="admin-content">
					{adminSection === 'bookings' ? renderBookingsSection() : renderInventorySection()}
				</div>

				{editingItem && (
					<div className="modal-overlay" onClick={() => setEditingItem(null)}>
						<div className="modal" onClick={(e) => e.stopPropagation()}>
							<h3>{editingItem.new ? 'Add New' : 'Edit'} {editingItem.type}</h3>
							<p>Edit form would go here...</p>
							<div className="modal-actions">
								<button className="btn-secondary" onClick={() => setEditingItem(null)}>Cancel</button>
								<button className="btn-primary" onClick={() => setEditingItem(null)}>Save</button>
							</div>
						</div>
					</div>
				)}
			</div>
		);
	};

	return (
		<div className="app">
			<style>{`
			:root{
			  --bg-900: #050505;
			  --bg-800: #0f0f10;
			  --panel: #121212;
			  --card: rgba(255,255,255,0.03);
			  --muted: #9aa0a6;
			  --text: #e9e9e9;
			  --accent: #f6c400; /* brand yellow */
			  --accent-700: #e5b000;
			  --glass: rgba(255,255,255,0.04);
			  --radius: 14px;
			  --transition: 220ms;
			}

			*{box-sizing:border-box}
			html,body,#root{height:100%}

			body{
			  margin:0; background: linear-gradient(180deg,var(--bg-900),var(--bg-800));
			  color:var(--text); font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
			}

			.app{min-height:100vh;padding:28px}

			.header{
			  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
			  border: 1px solid rgba(255,255,255,0.04);
			  border-radius: calc(var(--radius) + 6px);
			  padding:24px; margin-bottom:28px; display:flex; align-items:center; justify-content:space-between;
			}

			.logo{display:flex;gap:14px;align-items:center}
			.logo-icon{
			  width:62px;height:62px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-weight:800;color:#111;
			  background: linear-gradient(135deg,var(--accent-700),var(--accent)); font-size:20px; box-shadow: 0 8px 30px rgba(246,196,0,0.08);
			}
			.logo-text h1{font-size:20px;margin:0;color:var(--text)}
			.logo-text p{margin:0;color:var(--muted);font-size:13px}

			.view-toggle{display:flex;gap:8px;background:transparent;padding:6px;border-radius:12px}
			.view-toggle button{background:transparent;border:1px solid rgba(255,255,255,0.04);color:var(--muted);padding:8px 14px;border-radius:10px;cursor:pointer;transition:var(--transition)}
			.view-toggle button.active{background:var(--accent);color:#111;border-color:transparent;box-shadow:0 8px 30px rgba(246,196,0,0.12)}

			.main-content{
			  background: linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.02));
			  border:1px solid rgba(255,255,255,0.03); border-radius:16px; padding:28px;
			}

			/* Cards */
			.card{background:var(--card);border:1px solid rgba(255,255,255,0.04);border-radius:12px;padding:18px;transition:var(--transition);}
			.card:hover{transform:translateY(-6px);box-shadow:0 18px 40px rgba(2,6,23,0.6)}
			.card-icon{font-size:38px;margin-bottom:12px}
			.card h3{color:var(--text);margin:0 0 6px}
			.card .price{color:var(--accent);font-weight:700}

			.card.selected{border-color:rgba(246,196,0,0.18);box-shadow:0 10px 30px rgba(246,196,0,0.06)}
			.card::before{content:'';height:4px;width:100%;position:absolute;left:0;top:0;border-radius:8px;background:linear-gradient(90deg,var(--accent),#eab308);transform:scaleX(0);transform-origin:left;transition:var(--transition)}
			.card:hover::before{transform:scaleX(1)}

			.selected-badge{background:var(--accent);color:#111;padding:6px 10px;border-radius:999px;font-weight:700}

			.form-actions{display:flex;gap:12px;justify-content:flex-end}
			.btn-primary{background:var(--accent);color:#111;border:none;padding:12px 20px;border-radius:12px;cursor:pointer;font-weight:700;box-shadow:0 12px 30px rgba(246,196,0,0.12)}
			.btn-primary:disabled{opacity:0.5;cursor:not-allowed}
			.btn-secondary{background:transparent;border:1px solid rgba(255,255,255,0.06);color:var(--muted);padding:12px 18px;border-radius:12px}

			.cost-summary{background:linear-gradient(90deg, rgba(20,20,20,0.7), rgba(26,26,26,0.7));border:1px solid rgba(255,255,255,0.03);padding:20px;border-radius:12px}
			.cost-total span:last-child{color:var(--accent);font-weight:800}

			.summary-item svg, .event-item svg{color:var(--accent)}

			/* Admin */
			.admin-panel{display:grid;grid-template-columns:240px 1fr;gap:24px}
			.admin-sidebar{background:var(--panel);border-radius:12px;padding:18px;border:1px solid rgba(255,255,255,0.02)}

			/* responsive tweaks */
			@media (max-width:900px){
			  .admin-panel{grid-template-columns:1fr}
			  .cards-grid{grid-template-columns:1fr}
			}

			/* Hero */
			.hero{margin-bottom:22px;padding:28px;border-radius:12px;background:linear-gradient(90deg, rgba(255,255,255,0.02), rgba(0,0,0,0.02));border:1px solid rgba(255,255,255,0.03)}
			.hero-inner{max-width:1200px;width:100%;display:flex;gap:24px;align-items:center;justify-content:space-between}
			.hero-copy h2{font-size:34px;margin:0 0 8px;color:var(--text);letter-spacing:-0.4px}
			.hero-copy p{color:var(--muted);font-size:16px;margin:0 0 16px}
			.hero-ctas{display:flex;gap:12px}
			.hero-visual .hero-card{width:260px;height:160px;border-radius:12px;background:linear-gradient(135deg,var(--accent-700),var(--accent));display:flex;align-items:center;justify-content:center;font-size:44px;color:#111;box-shadow:0 20px 60px rgba(246,196,0,0.12)}
			@media (max-width:900px){
			  .hero-inner{flex-direction:column;align-items:flex-start}
			  .hero-visual{display:none}
			}

			/* subtle animations */
			@keyframes floatIn {from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
			.header, .main-content, .card{animation:floatIn var(--transition) ease forwards}
			`}</style>

			<div className="header">
				<div className="header-content">
					<div className="logo">
						<div className="logo-icon">EM</div>
						<div className="logo-text">
							<h1>Event Manager Pro</h1>
							<p>Complete Event Management Solution</p>
						</div>
					</div>
					<div className="header-actions">
						<div className="view-toggle">
							<button
								className={currentView === 'customer' ? 'active' : ''}
								onClick={() => setCurrentView('customer')}
							>
								Customer Portal
							</button>
							<button
								className={currentView === 'admin' ? 'active' : ''}
								onClick={() => setCurrentView('admin')}
							>
								Admin Panel
							</button>
						</div>
					</div>
				</div>
			</div>

			<div className="hero">
				<div className="hero-inner">
					<div className="hero-copy">
						<h2>Host Unforgettable Events</h2>
						<p>Design, plan and execute weddings, conferences and private events with confidence — full-service tools from booking to confirmation.</p>
						<div className="hero-ctas">
							<button className="btn-primary" onClick={() => { setCurrentView('customer'); setCurrentStep('booking'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Book a Venue</button>
							<button className="btn-secondary" onClick={() => setCurrentView('admin')}>Manage Inventory</button>
						</div>
					</div>
					<div className="hero-visual">
						<div className="hero-card">✨</div>
					</div>
				</div>
			</div>

			<div className="main-content">
				{currentView === 'customer' && (
					<>
						{currentStep === 'booking' && <BookingForm />}
						{currentStep === 'calendar' && <CalendarView />}
						{currentStep === 'payment' && <PaymentInterface />}
						{currentStep === 'confirmation' && <Confirmation />}
					</>
				)}

				{currentView === 'admin' && <AdminPanel />}
			</div>
		</div>
	);
};

export default EventManagementApp;