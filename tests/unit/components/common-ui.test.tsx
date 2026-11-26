import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button, Input, EmptyState, ErrorState, Pagination } from '@/components/common';

describe('Common UI Primitives (Unit)', () => {
  it('FE-UI-001: Button handles click, disabled, loading, and asChild leftIcon states', () => {
    const onClick = vi.fn();
    const { rerender } = render(<Button onClick={onClick}>Save Changes</Button>);

    const btn = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(
      <Button asChild leftIcon={<span data-testid="plus-icon">+</span>}>
        <a href="/create">Create Item</a>
      </Button>,
    );
    expect(screen.getByTestId('plus-icon')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /create item/i })).toHaveAttribute('href', '/create');

    rerender(
      <Button onClick={onClick} disabled>
        Save Changes
      </Button>,
    );
    expect(screen.getByRole('button', { name: /save changes/i })).toBeDisabled();

    rerender(
      <Button onClick={onClick} isLoading>
        Save Changes
      </Button>,
    );
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('FE-UI-001: Input renders label, error message, and updates value', () => {
    const onChange = vi.fn();
    render(
      <Input
        label="Company Email"
        placeholder="name@company.com"
        error="Invalid email"
        onChange={onChange}
      />,
    );

    const input = screen.getByPlaceholderText('name@company.com');
    fireEvent.change(input, { target: { value: 'ops@mercora.com' } });
    expect(onChange).toHaveBeenCalled();
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });

  it('FE-UI-001: EmptyState and ErrorState trigger action and retry callbacks', () => {
    const onClear = vi.fn();
    const onRetry = vi.fn();

    render(
      <>
        <EmptyState title="No results" description="Try another query" actionLabel="Reset" onAction={onClear} />
        <ErrorState title="Failed" message="Network timeout" onRetry={onRetry} />
      </>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(onClear).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: /try again|retry/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('FE-UI-001: Pagination emits page changes', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={5} pageSize={12} onPageChange={onPageChange} />);

    fireEvent.click(screen.getByRole('button', { name: '2' }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});
