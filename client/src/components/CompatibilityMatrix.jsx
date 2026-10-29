import React, { useState } from 'react';
import { GitMerge, HeartHandshake, ShieldCheck, Info } from 'lucide-react';

const COMPATIBILITY_DATA = [
  {
    type: 'O-',
    givesTo: ['All Blood Types (O-, O+, A-, A+, B-, B+, AB-, AB+)'],
    receivesFrom: ['O-'],
    note: 'Universal Red Blood Cell Donor'
  },
  {
    type: 'O+',
    givesTo: ['O+', 'A+', 'B+', 'AB+'],
    receivesFrom: ['O+', 'O-'],
    note: 'Most requested blood type'
  },
  {
    type: 'A-',
    givesTo: ['A-', 'A+', 'AB-', 'AB+'],
    receivesFrom: ['A-', 'O-'],
    note: 'Can donate to any A or AB patient'
  },
  {
    type: 'A+',
    givesTo: ['A+', 'AB+'],
    receivesFrom: ['A+', 'A-', 'O+', 'O-'],
    note: 'Second most common blood type'
  },
  {
    type: 'B-',
    givesTo: ['B-', 'B+', 'AB-', 'AB+'],
    receivesFrom: ['B-', 'O-'],
    note: 'Rare blood type'
  },
  {
    type: 'B+',
    givesTo: ['B+', 'AB+'],
    receivesFrom: ['B+', 'B-', 'O+', 'O-'],
    note: 'Can donate to B+ and AB+'
  },
  {
    type: 'AB-',
    givesTo: ['AB-', 'AB+'],
    receivesFrom: ['AB-', 'A-', 'B-', 'O-'],
    note: 'Rare blood group'
  },
  {
    type: 'AB+',
    givesTo: ['AB+'],
    receivesFrom: ['All Blood Types (A+, A-, B+, B-, AB+, AB-, O+, O-)'],
    note: 'Universal Red Blood Cell Recipient'
  }
];

export default function CompatibilityMatrix({ setActiveTab }) {
  const [selectedGroup, setSelectedGroup] = useState('O+');
  const [checkerRole, setCheckerRole] = useState('donor'); // 'donor' or 'patient'

  const currentInfo = COMPATIBILITY_DATA.find((c) => c.type === selectedGroup);

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Blood Compatibility Guide</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Understanding human blood compatibility ensures safe and timely transfusions
        </p>
      </div>

      {/* Interactive Quick Checker */}
      <div className="form-card" style={{ maxWidth: '100%', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <HeartHandshake size={24} style={{ color: 'var(--primary)' }} />
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Interactive Blood Match Checker</h2>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', background: '#f1f5f9', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
            <button
              type="button"
              className={`btn btn-sm ${checkerRole === 'donor' ? 'btn-primary' : 'btn-outline'}`}
              style={{ border: 'none' }}
              onClick={() => setCheckerRole('donor')}
            >
              I am a Donor
            </button>
            <button
              type="button"
              className={`btn btn-sm ${checkerRole === 'patient' ? 'btn-primary' : 'btn-outline'}`}
              style={{ border: 'none' }}
              onClick={() => setCheckerRole('patient')}
            >
              I am a Patient / Hospital
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Select Blood Group:</span>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="form-control"
              style={{ width: 'auto', fontWeight: 800, color: 'var(--primary)', padding: '0.4rem 0.85rem' }}
            >
              {COMPATIBILITY_DATA.map((c) => (
                <option key={c.type} value={c.type}>{c.type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Checker Result Card */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem'
        }}>
          {checkerRole === 'donor' ? (
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                With blood group <span style={{ color: 'var(--primary)', fontSize: '1.25rem' }}>{selectedGroup}</span>, you can safely donate blood to:
              </div>
              <div className="compat-pill-list" style={{ marginTop: '0.5rem' }}>
                {currentInfo.givesTo.map((item) => (
                  <span key={item} className="group-tag match" style={{ fontSize: '1rem', padding: '0.35rem 0.8rem' }}>
                    {item}
                  </span>
                ))}
              </div>
              <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                ⭐ {currentInfo.note}
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                A patient with blood group <span style={{ color: 'var(--primary)', fontSize: '1.25rem' }}>{selectedGroup}</span> can safely receive blood from:
              </div>
              <div className="compat-pill-list" style={{ marginTop: '0.5rem' }}>
                {currentInfo.receivesFrom.map((item) => (
                  <span key={item} className="group-tag match" style={{ fontSize: '1rem', padding: '0.35rem 0.8rem' }}>
                    {item}
                  </span>
                ))}
              </div>
              <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                ⭐ {currentInfo.note}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Universal Matrix Table */}
      <div className="compatibility-table-wrap">
        <table className="compat-table">
          <thead>
            <tr>
              <th>Blood Type</th>
              <th>Can Donate To (Gives)</th>
              <th>Can Receive From</th>
              <th>Medical Significance</th>
            </tr>
          </thead>
          <tbody>
            {COMPATIBILITY_DATA.map((row) => (
              <tr key={row.type}>
                <td>
                  <span className="blood-type-pill" style={{ width: '38px', height: '38px', fontSize: '0.95rem' }}>
                    {row.type}
                  </span>
                </td>
                <td>
                  <div className="compat-pill-list">
                    {row.givesTo.map((g) => (
                      <span key={g} className="group-tag match">{g}</span>
                    ))}
                  </div>
                </td>
                <td>
                  <div className="compat-pill-list">
                    {row.receivesFrom.map((r) => (
                      <span key={r} className="group-tag">{r}</span>
                    ))}
                  </div>
                </td>
                <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  {row.note}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Facts Banner */}
      <div style={{
        marginTop: '2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem'
      }}>
        <div style={{ background: 'white', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.4rem' }}>
            <ShieldCheck size={18} />
            Universal Donor: O Negative
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            O Negative red blood cells can be transfused into patients of any blood group. In severe emergency trauma, O Negative is given when there is no time to test the patient's blood.
          </p>
        </div>

        <div style={{ background: 'white', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--info)', marginBottom: '0.4rem' }}>
            <Info size={18} />
            Universal Recipient: AB Positive
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            People with AB Positive blood can safely receive red blood cells from any blood type. However, they can only donate red blood cells to other AB Positive individuals.
          </p>
        </div>
      </div>
    </div>
  );
}

