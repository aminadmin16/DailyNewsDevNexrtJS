'use client';

import { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';

export default function AquaShare() {
  const [totalWaterCost, setTotalWaterCost] = useState(1200);
  const [users, setUsers] = useState([{ name: '', amount: 300 }]);
  const [timeOfDay, setTimeOfDay] = useState<'กลางวัน' | 'กลางคืน'>('กลางวัน');
  const [dateString, setDateString] = useState('');
  const [editableDate, setEditableDate] = useState('');
  const contentRef = useRef(null);

  useEffect(() => {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear() + 543;
    const months = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    const formatted = `${day} เดือน ${months[month]} ปี ${year}`;
    setDateString(formatted);
    setEditableDate(formatted);
  }, []);

  const handleAmountChange = (index: number, value: number) => {
    const newUsers = [...users];
    newUsers[index].amount = value;
    setUsers(newUsers);
  };

  const handleDivide = (index: number, divisor: number) => {
    const newUsers = [...users];
    newUsers[index].amount = Math.round(newUsers[index].amount / divisor);
    setUsers(newUsers);

    // Add rows based on divisor
    if (divisor === 2) {
      setUsers([...newUsers, { ...newUsers[index] }]);
    } else if (divisor === 3) {
      setUsers([...newUsers, { ...newUsers[index] }, { ...newUsers[index] }]);
    }
  };

  const removeUser = (index: number) => {
    if (index === 0) return; // Don't allow deleting the first row

    const newUsers = users.filter((_, i) => i !== index);
    setUsers(newUsers);

    // If all rows are removed, add the default row back
    if (newUsers.length === 0) {
      setUsers([{ name: '', amount: 300 }]);
    }
  };

  const addUser = () => {
    const newUsers = [...users];
    const remaining = totalWaterCost - newUsers.reduce((sum, user) => sum + user.amount, 0);
    const newAmount = remaining > 0 ? remaining : 300; // Use remaining if it's positive, else use default amount
    newUsers.push({ name: '', amount: newAmount });
    setUsers(newUsers);
  };

  // New clear function to reset all user data
  const clearFields = () => {
    const newUsers = users.map(user => ({
      name: '',
      amount: 300,
    }));
    setUsers(newUsers);
  };

  const totalPaid = users.reduce((sum, user) => sum + user.amount, 0);
  const remaining = totalWaterCost - totalPaid;

  const exportToImage = async () => {
    if (contentRef.current) {
      const canvas = await html2canvas(contentRef.current);
      const link = document.createElement('a');
      link.download = 'water-share.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditableDate(e.target.value);
  };

  const toggleTimeOfDay = () => {
    setTimeOfDay(prev => (prev === 'กลางวัน' ? 'กลางคืน' : 'กลางวัน'));
  };

  return (
    <div className="container" style={{ color: '#1a1a1a', backgroundColor: '#f9f9f9' }}>
      <h1 className="heading" style={{ color: '#005580' }}>💧 ระบบค่าน้ำคลองชุมชน</h1>

      <div className="input-group">
        <label className="label" style={{ color: '#333' }}>ค่าน้ำทั้งหมด (บาท)</label>
        <input
          type="number"
          className="input"
          value={totalWaterCost}
          onChange={(e) => setTotalWaterCost(Number(e.target.value) || 1200)}
        />
      </div>



      <div ref={contentRef}>
        <div className="date-label" style={{ fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="date-group" style={{ display: 'flex', alignItems: 'center' }}>

            <input
              type="text"
              className="input"
              value={editableDate}
              onChange={handleDateChange}
              style={{ marginRight: '20px', width: '100%' }}
            />
          </div>

          <span className="red-text" style={{ fontSize: '18px', color: 'red' }}>
            <div className="button-group">
              <button
                className={`button ${timeOfDay === 'กลางวัน' ? 'highlight-day' : ''}`}
                onClick={toggleTimeOfDay}
              >
                {timeOfDay === 'กลางวัน' ? '☀️ กลางวัน' : '🌙 กลางคืน'}
              </button>
            </div>
          </span>
        </div>




        {users.map((user, index) => (
          <div key={index} className="user-row">
            <input
              type="text"
              className="input"
              value={user.name}
              onChange={(e) => {
                const newUsers = [...users];
                newUsers[index].name = e.target.value;
                setUsers(newUsers);
              }}
            />
            <input
              type="text"
              className="input"
              style={{ width: '80px' }}
              value={user.amount}
              onChange={(e) => {
                const rawValue = e.target.value;
                const numericValue = rawValue.replace(/^0+/, ''); // ตัดศูนย์นำหน้า
                const valueAsNumber = Number(numericValue) || 0;

                const newUsers = [...users];
                newUsers[index].amount = valueAsNumber;
                setUsers(newUsers);
              }}
            />
            {/* Show divide buttons only for rows other than the last one */}
            {index === users.length - 1 && (
              <>
                <button className="button small" onClick={() => handleDivide(index, 2)}>÷2</button>
                <button className="button small" onClick={() => handleDivide(index, 3)}>÷3</button>
              </>
            )}

            {/* Add delete button, but don't allow deleting the first row */}
            {index !== 0 && (
              <button className="button small" onClick={() => removeUser(index)}>❌ ลบ</button>
            )}
          </div>
        ))}

        <div className="amount-display" style={{ fontWeight: 'bold', color: '#333' }}>
          รวมที่จ่ายแล้ว: {totalPaid} บาท<br />
          ยังขาด: <span className="red-text" style={{ color: 'red' }}>{remaining > 0 ? remaining : 0}</span> บาท
        </div>
      </div>

      <button onClick={addUser} className="button full-width">
        ➕ เพิ่มผู้ใช้น้ำ
      </button>

      <button onClick={exportToImage} className="button full-width">
        📤 แชร์รายการเป็นภาพ
      </button>

    </div>
  );
}
