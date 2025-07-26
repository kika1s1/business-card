import html2canvas from 'html2canvas';

class CardExportService {
  constructor() {
    this.defaultOptions = {
      width: 1575, // 3.5 inches at 450 DPI for high quality
      height: 900,  // 2 inches at 450 DPI  
      scale: 3, // Higher scale for better quality
      backgroundColor: 'transparent',
      logging: false,
      allowTaint: true,
      useCORS: true,
      imageTimeout: 15000,
      removeContainer: true,
      foreignObjectRendering: true,
      letterRendering: true
    };
  }

  /**
   * Prepare card element for export by temporarily adjusting styles
   */
  prepareCardForExport(cardElement) {
    // Store original styles
    const originalStyles = {
      transform: cardElement.style.transform,
      transition: cardElement.style.transition,
      cursor: cardElement.style.cursor,
      boxShadow: cardElement.style.boxShadow
    };

    // Apply export-friendly styles
    cardElement.style.transform = 'none';
    cardElement.style.transition = 'none';
    cardElement.style.cursor = 'default';
    cardElement.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.25)';

    // Remove hover effects temporarily
    cardElement.classList.add('export-mode');

    return originalStyles;
  }

  /**
   * Restore original styles after export
   */
  restoreCardStyles(cardElement, originalStyles) {
    Object.keys(originalStyles).forEach(prop => {
      if (originalStyles[prop]) {
        cardElement.style[prop] = originalStyles[prop];
      } else {
        cardElement.style.removeProperty(prop);
      }
    });

    cardElement.classList.remove('export-mode');
  }

  /**
   * Export card as PNG with high quality
   * @param {HTMLElement} cardElement - The card DOM element to export
   * @param {string} filename - The filename for the download
   * @param {Object} options - Export options
   */
  async exportAsPNG(cardElement, filename = 'business-card.png', options = {}) {
    console.log('exportAsPNG called with:', { cardElement, filename, options });
    
    try {
      // Validate input
      if (!cardElement) {
        throw new Error('Card element is null or undefined');
      }
      
      if (cardElement.offsetWidth === 0 || cardElement.offsetHeight === 0) {
        throw new Error('Card element has no visible dimensions');
      }
      
      const exportOptions = { ...this.defaultOptions, ...options };
      console.log('Export options:', exportOptions);
      
      // Prepare card for export
      const originalStyles = this.prepareCardForExport(cardElement);
      console.log('Card prepared for export');
      
      // Wait a moment for styles to apply
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Generate canvas from HTML element
      console.log('Starting html2canvas...');
      const canvas = await html2canvas(cardElement, exportOptions);
      console.log('Canvas generated:', { width: canvas.width, height: canvas.height });
      
      // Restore original styles
      this.restoreCardStyles(cardElement, originalStyles);
      console.log('Styles restored');
      
      // Validate canvas
      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error('Generated canvas is invalid or empty');
      }
      
      // Create download link
      const link = document.createElement('a');
      link.download = filename;
      
      try {
        link.href = canvas.toDataURL('image/png', 1.0);
        console.log('Canvas converted to data URL');
      } catch (canvasError) {
        throw new Error('Failed to convert canvas to image: ' + canvasError.message);
      }
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log('Download triggered successfully');
      
      return { success: true, canvas };
    } catch (error) {
      console.error('Error exporting PNG:', error);
      throw new Error('Failed to export card as PNG: ' + error.message);
    }
  }

  /**
   * Export card as PDF with proper dimensions
   * @param {HTMLElement} cardElement - The card DOM element to export
   * @param {string} filename - The filename for the download
   */
  async exportAsPDF(cardElement, filename = 'business-card.pdf') {
    console.log('exportAsPDF called with:', { cardElement, filename });
    
    try {
      // Validate input
      if (!cardElement) {
        throw new Error('Card element is null or undefined');
      }
      
      if (cardElement.offsetWidth === 0 || cardElement.offsetHeight === 0) {
        throw new Error('Card element has no visible dimensions');
      }
      
      // Dynamic import for jsPDF
      console.log('Importing jsPDF...');
      let jsPDF;
      try {
        const jsPDFModule = await import('jspdf');
        jsPDF = jsPDFModule.default || jsPDFModule.jsPDF;
        console.log('jsPDF imported successfully');
      } catch (importError) {
        console.error('Failed to import jsPDF:', importError);
        throw new Error('Failed to load PDF library: ' + importError.message);
      }
      
      // Prepare card for export
      const originalStyles = this.prepareCardForExport(cardElement);
      console.log('Card prepared for export');
      
      // Wait for styles to apply
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Generate canvas first
      console.log('Starting html2canvas for PDF...');
      const canvas = await html2canvas(cardElement, {
        ...this.defaultOptions,
        backgroundColor: '#ffffff' // White background for PDF
      });
      console.log('Canvas generated for PDF:', { width: canvas.width, height: canvas.height });
      
      // Restore original styles
      this.restoreCardStyles(cardElement, originalStyles);
      console.log('Styles restored');
      
      // Validate canvas
      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error('Generated canvas is invalid or empty');
      }
      
      // Create PDF with business card dimensions (3.5" x 2")
      console.log('Creating PDF document...');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'in',
        format: [3.5, 2] // Business card dimensions
      });
      
      // Convert canvas to image data
      let imgData;
      try {
        imgData = canvas.toDataURL('image/png', 1.0);
        console.log('Canvas converted to image data for PDF');
      } catch (canvasError) {
        throw new Error('Failed to convert canvas to image: ' + canvasError.message);
      }
      
      // Add image to PDF (fill the entire page)
      try {
        pdf.addImage(imgData, 'PNG', 0, 0, 3.5, 2);
        console.log('Image added to PDF');
      } catch (pdfError) {
        throw new Error('Failed to add image to PDF: ' + pdfError.message);
      }
      
      // Save the PDF
      try {
        pdf.save(filename);
        console.log('PDF saved successfully');
      } catch (saveError) {
        throw new Error('Failed to save PDF: ' + saveError.message);
      }
      
      return { success: true, pdf };
    } catch (error) {
      console.error('Error exporting PDF:', error);
      throw new Error('Failed to export card as PDF: ' + error.message);
    }
  }

  /**
   * Export card as multiple formats (PNG + PDF)
   * @param {HTMLElement} cardElement - The card DOM element to export
   * @param {string} baseName - Base filename without extension
   */
  async exportMultipleFormats(cardElement, baseName = 'business-card') {
    try {
      const results = {};
      
      // Export PNG
      try {
        results.png = await this.exportAsPNG(cardElement, `${baseName}.png`);
      } catch (error) {
        results.png = { success: false, error: error.message };
      }
      
      // Wait a moment between exports
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Export PDF
      try {
        results.pdf = await this.exportAsPDF(cardElement, `${baseName}.pdf`);
      } catch (error) {
        results.pdf = { success: false, error: error.message };
      }
      
      return results;
    } catch (error) {
      console.error('Error exporting multiple formats:', error);
      throw new Error('Failed to export in multiple formats: ' + error.message);
    }
  }

  /**
   * Get card preview as base64 data URL
   * @param {HTMLElement} cardElement - The card DOM element
   * @param {string} format - 'png' or 'jpeg'
   * @param {number} quality - Quality from 0.1 to 1.0
   */
  async getCardPreview(cardElement, format = 'png', quality = 0.8) {
    try {
      const originalStyles = this.prepareCardForExport(cardElement);
      
      const canvas = await html2canvas(cardElement, {
        ...this.defaultOptions,
        scale: 1, // Lower scale for preview
        width: 350, // Smaller dimensions for preview
        height: 200
      });
      
      this.restoreCardStyles(cardElement, originalStyles);
      
      const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
      return canvas.toDataURL(mimeType, quality);
    } catch (error) {
      console.error('Error generating preview:', error);
      throw new Error('Failed to generate card preview: ' + error.message);
    }
  }

  /**
   * Validate card element before export
   * @param {HTMLElement} cardElement - The card DOM element
   */
  validateCardElement(cardElement) {
    if (!cardElement) {
      throw new Error('Card element is required for export');
    }
    
    if (!cardElement.offsetWidth || !cardElement.offsetHeight) {
      throw new Error('Card element has no dimensions');
    }
    
    return true;
  }

  /**
   * Get print-ready dimensions in various units
   */
  getPrintDimensions() {
    return {
      inches: { width: 3.5, height: 2 },
      pixels: { width: 1050, height: 600 }, // 300 DPI
      mm: { width: 88.9, height: 50.8 },
      points: { width: 252, height: 144 }
    };
  }

  /**
   * Simple fallback export using basic browser screenshot
   * @param {HTMLElement} cardElement - The card DOM element to export
   * @param {string} filename - The filename for the download
   */
  async exportFallback(cardElement, filename = 'business-card.png') {
    console.log('Using fallback export method');
    
    try {
      // Use basic html2canvas with minimal options
      const canvas = await html2canvas(cardElement, {
        width: 350,
        height: 200,
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false
      });
      
      // Simple download
      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return { success: true, method: 'fallback' };
    } catch (error) {
      console.error('Fallback export also failed:', error);
      throw new Error('All export methods failed: ' + error.message);
    }
  }
}

// Create and export singleton instance
const cardExport = new CardExportService();
export default cardExport; 