'use client';

import { useState, useEffect } from 'react';
import { Select, useToast } from '@chakra-ui/react';
import { Company } from '../../../lib/types';
import { authApi } from '../../../lib/auth';

interface SelectCompanyProps {
  value?: string;
  onChange: (value: string) => void;
}

export default function SelectCompany({ value, onChange }: SelectCompanyProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoading(true);
        const response = await authApi.getAllCompanies();
        console.log('Company API Response:', response); // For debugging

        // Ensure companies is always an array
        let companyData = [];
        if (Array.isArray(response.data)) {
          companyData = response.data;
        } else if (response.data && typeof response.data === 'object') {
          // If response.data is an object, try to find an array property
          const possibleArrays = ['items', 'data', 'companies', 'results'];
          for (const key of possibleArrays) {
            if (Array.isArray(response.data[key])) {
              companyData = response.data[key];
              break;
            }
          }
        }

        setCompanies(companyData);

        if (companyData.length === 0) {
          toast({
            title: 'No companies found',
            status: 'warning',
            duration: 3000,
          });
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
        toast({
          title: 'Error loading companies',
          description: 'Failed to load company list',
          status: 'error',
          duration: 3000,
        });
        setCompanies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, [toast]);

  if (isLoading) {
    return (
      <Select
        placeholder="Loading companies..."
        isDisabled
      />
    );
  }

  return (
    <Select
      placeholder="Select company"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      isDisabled={isLoading}
    >
      {Array.isArray(companies) && companies.length > 0 ? (
        companies.map((company) => (
          <option key={company.id} value={company.id}>
            {company.name}
          </option>
        ))
      ) : (
        <option value="" disabled>No companies available</option>
      )}
    </Select>
  );
}