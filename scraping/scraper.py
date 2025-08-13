#!/usr/bin/env python3
"""
Udyam Registration Portal Web Scraper
Extracts form fields, validation rules, and UI structure from the Udyam portal
"""

import requests
from bs4 import BeautifulSoup
import json
import re
from datetime import datetime
from typing import Dict, List, Any, Optional
import argparse
import sys

class UdyamScraper:
    def __init__(self):
        self.base_url = "https://udyamregistration.gov.in/UdyamRegistration.aspx"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        })

    def get_page_content(self) -> Optional[BeautifulSoup]:
        """Fetch the Udyam registration page content"""
        try:
            print("🌐 Fetching Udyam registration page...")
            response = self.session.get(self.base_url, timeout=30)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            print("✅ Page fetched successfully")
            return soup
            
        except requests.RequestException as e:
            print(f"❌ Error fetching page: {e}")
            return None

    def extract_field_validation(self, field) -> Dict[str, Any]:
        """Extract validation rules from a form field"""
        validation = {}
        
        # Check for required attribute
        validation['required'] = field.get('required', False)
        
        # Check for pattern attribute
        pattern = field.get('pattern')
        if pattern:
            validation['pattern'] = pattern
        
        # Check for maxlength attribute
        maxlength = field.get('maxlength')
        if maxlength:
            validation['maxlength'] = int(maxlength)
        
        # Check for minlength attribute
        minlength = field.get('minlength')
        if minlength:
            validation['minlength'] = int(minlength)
        
        # Check for type-specific validation
        field_type = field.get('type', 'text')
        if field_type == 'email':
            validation['pattern'] = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
            validation['message'] = 'Please enter a valid email address'
        elif field_type == 'tel':
            validation['pattern'] = r'^[6-9]\d{9}$'
            validation['message'] = 'Please enter a valid 10-digit mobile number'
        
        return validation

    def extract_field_data(self, field) -> Dict[str, Any]:
        """Extract comprehensive data from a form field"""
        field_data = {
            'id': field.get('id', ''),
            'name': field.get('name', ''),
            'type': field.get('type', 'text'),
            'placeholder': field.get('placeholder', ''),
            'required': field.get('required', False),
            'disabled': field.get('disabled', False),
            'readonly': field.get('readonly', False),
            'class': field.get('class', []),
            'style': field.get('style', ''),
            'validation': self.extract_field_validation(field)
        }
        
        # Extract label if available
        label = field.find_previous('label')
        if label:
            field_data['label'] = label.get_text(strip=True)
        else:
            # Try to find label by for attribute
            field_id = field.get('id')
            if field_id:
                label = field.find('label', attrs={'for': field_id})
                if label:
                    field_data['label'] = label.get_text(strip=True)
                else:
                    field_data['label'] = field_id.replace('_', ' ').title()
            else:
                field_data['label'] = field.get('name', '').replace('_', ' ').title()
        
        # Handle different field types
        if field.name == 'select':
            field_data['options'] = []
            for option in field.find_all('option'):
                option_data = {
                    'value': option.get('value', ''),
                    'text': option.get_text(strip=True),
                    'selected': option.get('selected', False),
                    'disabled': option.get('disabled', False)
                }
                field_data['options'].append(option_data)
        
        elif field.name == 'input':
            # Handle specific input types
            if field.get('type') == 'checkbox':
                field_data['checked'] = field.get('checked', False)
            elif field.get('type') == 'radio':
                field_data['checked'] = field.get('checked', False)
                field_data['value'] = field.get('value', '')
        
        return field_data

    def scrape_step1_aadhaar_verification(self, soup: BeautifulSoup) -> List[Dict[str, Any]]:
        """Scrape Step 1: Aadhaar Verification fields"""
        print("📋 Scraping Step 1: Aadhaar Verification...")
        
        fields = []
        
        # Look for Aadhaar number field
        aadhaar_field = soup.find('input', {'id': 'ctl00_ContentPlaceHolder1_txtadharno'})
        if aadhaar_field:
            field_data = self.extract_field_data(aadhaar_field)
            field_data.update({
                'key': 'aadhaar_number',
                'label': 'Your Aadhaar No',
                'placeholder': 'Your Aadhaar No',
                'validation': {
                    'required': True,
                    'minlength': 12,
                    'maxlength': 12,
                    'pattern': r'^\d{12}$',
                    'message': 'Aadhaar number must be exactly 12 digits'
                }
            })
            fields.append(field_data)
        
        # Look for Entrepreneur name field
        name_field = soup.find('input', {'id': 'ctl00_ContentPlaceHolder1_txtownername'})
        if name_field:
            field_data = self.extract_field_data(name_field)
            field_data.update({
                'key': 'entrepreneur_name',
                'label': 'Name as per Aadhaar',
                'placeholder': 'Name as per Aadhaar',
                'validation': {
                    'required': True,
                    'minlength': 2,
                    'maxlength': 100,
                    'pattern': r'^[a-zA-Z\s]+$',
                    'message': 'Name must contain only letters and spaces'
                }
            })
            fields.append(field_data)
        
        # Look for Aadhaar consent checkbox
        consent_field = soup.find('input', {'id': 'ctl00_ContentPlaceHolder1_chkDecarationA'})
        if consent_field:
            field_data = self.extract_field_data(consent_field)
            field_data.update({
                'key': 'aadhaar_consent',
                'label': 'I consent to the use of my Aadhaar number for Udyam registration',
                'validation': {
                    'required': True,
                    'message': 'You must provide consent to proceed'
                }
            })
            fields.append(field_data)
        
        # Look for any additional fields in Step 1
        form_container = soup.find('form')
        if form_container:
            all_inputs = form_container.find_all(['input', 'select', 'textarea'])
            for field in all_inputs:
                if field.get('id') and not any(f['id'] == field.get('id') for f in fields):
                    field_data = self.extract_field_data(field)
                    field_data['key'] = field.get('id').lower().replace('ctl00_contentplaceholder1_', '').replace('_', '_')
                    fields.append(field_data)
        
        print(f"✅ Step 1: Found {len(fields)} fields")
        return fields

    def scrape_step2_pan_verification(self, soup: BeautifulSoup) -> List[Dict[str, Any]]:
        """Scrape Step 2: PAN Verification fields"""
        print("📋 Scraping Step 2: PAN Verification...")
        
        fields = []
        
        # Look for Type of Organisation dropdown
        org_type_field = soup.find('select', {'id': 'ctl00_ContentPlaceHolder1_ddltypeoforg'})
        if org_type_field:
            field_data = self.extract_field_data(org_type_field)
            field_data.update({
                'key': 'type_of_organisation',
                'label': 'Type of Organisation / संगठन के प्रकार',
                'validation': {
                    'required': True,
                    'message': 'Please select type of organisation'
                }
            })
            fields.append(field_data)
        
        # Look for PAN Number field
        pan_field = soup.find('input', {'id': 'ctl00_ContentPlaceHolder1_txtPan'})
        if pan_field:
            field_data = self.extract_field_data(pan_field)
            field_data.update({
                'key': 'pan_number',
                'label': 'Enter Pan Number',
                'placeholder': 'Enter Pan Number',
                'validation': {
                    'required': True,
                    'minlength': 10,
                    'maxlength': 10,
                    'pattern': r'^[A-Z]{5}[0-9]{4}[A-Z]{1}$',
                    'message': 'PAN must be in format: ABCDE1234F'
                }
            })
            fields.append(field_data)
        
        # Look for PAN Holder Name field
        pan_name_field = soup.find('input', {'id': 'ctl00_ContentPlaceHolder1_txtPanName'})
        if pan_name_field:
            field_data = self.extract_field_data(pan_name_field)
            field_data.update({
                'key': 'pan_holder_name',
                'label': 'Name as per PAN',
                'placeholder': 'Name as per PAN',
                'validation': {
                    'required': True,
                    'minlength': 2,
                    'maxlength': 100,
                    'pattern': r'^[a-zA-Z\s]+$',
                    'message': 'Name must contain only letters and spaces'
                }
            })
            fields.append(field_data)
        
        # Look for Date of Birth/Incorporation field
        dob_field = soup.find('input', {'id': 'ctl00_ContentPlaceHolder1_txtdob'})
        if dob_field:
            field_data = self.extract_field_data(dob_field)
            field_data.update({
                'key': 'date_of_birth_incorporation',
                'label': 'Date of Birth/Incorporation',
                'placeholder': 'DD/MM/YYYY',
                'validation': {
                    'required': True,
                    'message': 'Date of birth/incorporation is required'
                }
            })
            fields.append(field_data)
        
        # Look for PAN Consent checkbox
        pan_consent_field = soup.find('input', {'id': 'ctl00_ContentPlaceHolder1_chkDecarationP'})
        if pan_consent_field:
            field_data = self.extract_field_data(pan_consent_field)
            field_data.update({
                'key': 'pan_consent',
                'label': 'I consent to the use of my PAN data for Udyam registration',
                'validation': {
                    'required': True,
                    'message': 'You must provide PAN consent to proceed'
                }
            })
            fields.append(field_data)
        
        # Look for PAN Validate button
        validate_button = soup.find('input', {'id': 'ctl00_ContentPlaceHolder1_btnValidatePan'})
        if validate_button:
            field_data = self.extract_field_data(validate_button)
            field_data.update({
                'key': 'validate_pan_button',
                'label': 'PAN Validate',
                'type': 'submit'
            })
            fields.append(field_data)
        
        print(f"✅ Step 2: Found {len(fields)} fields")
        return fields

    def scrape_all_steps(self) -> Dict[str, Any]:
        """Scrape all steps and return comprehensive data"""
        print("🔄 Scraping all steps...")
        
        soup = self.get_page_content()
        if not soup:
            return {}
        
        step1_data = self.scrape_step1_aadhaar_verification(soup)
        step2_data = self.scrape_step2_pan_verification(soup)
        
        all_data = {
            'metadata': {
                'scraped_at': datetime.now().isoformat(),
                'source': self.base_url,
                'total_steps': 2,
                'total_fields': len(step1_data) + len(step2_data),
                'scraper_version': '1.0.0',
                'scraper_type': 'python_beautifulsoup'
            },
            'step1': {
                'title': 'Aadhaar Verification',
                'description': 'First step of Udyam registration requiring Aadhaar verification',
                'fields': step1_data
            },
            'step2': {
                'title': 'PAN Verification',
                'description': 'Second step of Udyam registration requiring PAN verification',
                'fields': step2_data
            }
        }
        
        return all_data

    def save_data(self, data: Dict[str, Any], filename: str) -> None:
        """Save scraped data to JSON file"""
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            print(f"💾 Data saved to: {filename}")
        except Exception as e:
            print(f"❌ Error saving data: {e}")

def main():
    parser = argparse.ArgumentParser(description='Scrape Udyam registration portal')
    parser.add_argument('--step', type=int, choices=[1, 2], help='Scrape specific step (1 or 2)')
    parser.add_argument('--all', action='store_true', help='Scrape all steps')
    parser.add_argument('--output', type=str, help='Output filename')
    
    args = parser.parse_args()
    
    scraper = UdyamScraper()
    
    try:
        if args.step == 1:
            soup = scraper.get_page_content()
            if soup:
                data = scraper.scrape_step1_aadhaar_verification(soup)
                filename = args.output or 'udyam_step1_complete.json'
                scraper.save_data(data, filename)
        elif args.step == 2:
            soup = scraper.get_page_content()
            if soup:
                data = scraper.scrape_step2_pan_verification(soup)
                filename = args.output or 'udyam_step2_complete.json'
                scraper.save_data(data, filename)
        else:
            # Default: scrape all steps
            data = scraper.scrape_all_steps()
            filename = args.output or 'udyam_complete_schema.json'
            scraper.save_data(data, filename)
            
    except KeyboardInterrupt:
        print("\n⚠️ Scraping interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Scraping failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
