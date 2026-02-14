"use client";
import React from 'react';

export const Text = ({ children, variant = 'body', color = 'var(--text-primary)', style }) => {
    const styles = {
        h1: { fontSize: '1.75rem', fontWeight: '800', marginBottom: '1rem', letterSpacing: '-0.025em' },
        h2: { fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem', letterSpacing: '-0.02em', color: 'var(--accent)' },
        body: { fontSize: '0.9rem', fontWeight: '400', lineHeight: '1.5', opacity: 0.9 },
        small: { fontSize: '0.75rem', fontWeight: '600', opacity: 0.5, letterSpacing: '0.05em', textTransform: 'uppercase' },
    };
    return <div style={{ ...styles[variant], color, ...style }}>{children}</div>;
};

export const Layout = ({ children, direction = 'column', gap = '16px', padding = '0', align = 'stretch', justify = 'flex-start', style }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: direction,
            gap,
            width: '100%',
            padding,
            alignItems: align,
            justifyContent: justify,
            ...style
        }}>
            {children}
        </div>
    );
};

export const Button = ({ label, variant = 'primary', onClick, disabled, style, children }) => {
    const variants = {
        primary: {
            backgroundColor: '#00e5ff',
            color: '#000',
            boxShadow: '0 4px 12px rgba(0, 229, 255, 0.2)'
        },
        secondary: {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        danger: { backgroundColor: '#ff4d4d', color: '#fff' },
    };
    const baseStyle = {
        padding: '10px 20px',
        borderRadius: '6px',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontWeight: '700',
        fontSize: '13px',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.2s',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        ...variants[variant],
        ...style
    };
    return (
        <button
            style={baseStyle}
            onClick={onClick}
            disabled={disabled}
            onMouseOver={(e) => !disabled && (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseOut={(e) => !disabled && (e.currentTarget.style.transform = 'translateY(0)')}
        >
            {label || children}
        </button>
    );
};

export const Card = ({ title, children, style }) => {
    const cardStyle = {
        background: '#141416',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        ...style
    };
    return (
        <div style={cardStyle}>
            {title && <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '16px', color: 'var(--accent)' }}>{title}</h2>}
            <div style={{ flex: 1 }}>{children}</div>
        </div>
    );
};

export const Input = ({ label, placeholder, value, onChange, type = "text", style }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', marginBottom: '12px', ...style }}>
            {label && (
                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {label}
                </label>
            )}
            <input
                type={type}
                style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box'
                }}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onFocus={(e) => e.target.style.borderColor = '#00e5ff'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
            />
        </div>
    );
};

export const Table = ({ columns = [], data = [], style }) => {
    return (
        <div style={{ overflowX: 'auto', ...style }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                <thead>
                    <tr>
                        {columns && columns.map((col, i) => (
                            <th key={i} style={{ textAlign: 'left', padding: '0 12px', color: '#444', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase' }}>
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data && data.map((row, i) => (
                        <tr key={i} style={{ background: 'rgba(255, 255, 255, 0.01)' }}>
                            {columns && columns.map((col, j) => (
                                <td key={j} style={{
                                    padding: '12px',
                                    color: '#eee',
                                    fontSize: '13px',
                                    borderTop: '1px solid rgba(255, 255, 255, 0.03)',
                                    borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
                                    borderLeft: j === 0 ? '1px solid rgba(255, 255, 255, 0.03)' : 'none',
                                    borderRight: j === columns.length - 1 ? '1px solid rgba(255, 255, 255, 0.03)' : 'none',
                                    borderTopLeftRadius: j === 0 ? '8px' : 0,
                                    borderBottomLeftRadius: j === 0 ? '8px' : 0,
                                    borderTopRightRadius: j === columns.length - 1 ? '8px' : 0,
                                    borderBottomRightRadius: j === columns.length - 1 ? '8px' : 0,
                                }}>
                                    {row[col.toLowerCase()] || row[col]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export const Chart = ({ type, data = [], title, style }) => {
    const maxValue = data && data.length > 0 ? Math.max(...(data.map(d => d.value) || [1])) : 1;
    return (
        <Card title={title} style={style}>
            <div style={{ height: '150px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: '10px 0 20px 0', position: 'relative' }}>
                {data && data.map((item, i) => (
                    <div key={i} style={{
                        width: '24px',
                        background: '#00e5ff',
                        height: `${(item.value / maxValue) * 100}%`,
                        borderRadius: '4px 4px 0 0',
                        position: 'relative'
                    }}>
                        <div style={{ position: 'absolute', bottom: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '9px', color: '#444', whiteSpace: 'nowrap' }}>
                            {item.label}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export const Form = ({ title, fields = [], actions = [], children, style }) => {
    return (
        <Card title={title} style={style}>
            {fields && fields.map((f, i) => <Input key={i} {...f} />)}
            {children}
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                {actions && actions.map((a, i) => <Button key={i} {...a} />)}
            </div>
        </Card>
    );
};

export const Sidebar = ({ items = [], activeItem }) => {
    return (
        <div style={{ width: '240px', height: '100%', padding: '30px 20px', background: '#0f172a', borderRight: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#00e5ff', marginBottom: '32px' }}>RYZE_AI</div>
            <Layout gap="4px">
                {items && items.map((item, i) => (
                    <div key={i} style={{
                        padding: '10px 14px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        background: item === activeItem ? 'rgba(0, 229, 255, 0.05)' : 'transparent',
                        color: item === activeItem ? '#00e5ff' : '#64748b',
                        fontWeight: '700',
                        fontSize: '13px',
                        transition: 'all 0.2s'
                    }}>
                        {item}
                    </div>
                ))}
            </Layout>
        </div>
    );
};

export const Navbar = ({ title, actions = [] }) => {
    return (
        <div style={{ height: '60px', padding: '0 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0f172a', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ fontSize: '16px', fontWeight: '800', color: '#fff' }}>{title}</div>
            <div style={{ display: 'flex', gap: '20px' }}>
                {actions && actions.map((a, i) => (
                    <div key={i} style={{ cursor: 'pointer', fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>{a}</div>
                ))}
            </div>
        </div>
    );
};

export const Modal = ({ title, isOpen, children, onClose }) => {
    if (!isOpen) return null;
    return (
        <div style={{ position: 'fixed', inset: 0, zCenter: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}>
            <Card title={title} style={{ width: '400px' }}>
                {children}
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button label="Close" onClick={onClose} variant="secondary" />
                </div>
            </Card>
        </div>
    );
};

export const Box = ({ children, style, onClick }) => {
    return (
        <div onClick={onClick} style={{
            display: 'flex',
            flexDirection: 'column',
            ...style
        }}>
            {children}
        </div>
    );
};

export const Image = ({ src, alt, style }) => {
    return (
        <img src={src} alt={alt} style={{
            maxWidth: '100%',
            height: 'auto',
            display: 'block',
            objectFit: 'cover',
            borderRadius: '8px',
            ...style
        }} />
    );
};
