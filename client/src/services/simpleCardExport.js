import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Simplified card export service with better error handling
 */
class SimpleCardExportService {
  constructor() {
    this.isExporting = false;
  }

  /**
   * Simple PNG export with minimal configuration
   */
  async exportPNG(cardElement, filename = 'business-card.png') {
    if (this.isExporting) {
      throw new Error('Export already in progress');
    }

    console.log('Starting simple PNG export...');
    this.isExporting = true;

    try {
      // Validate element
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      if (!cardElement.offsetWidth || !cardElement.offsetHeight) {
        throw new Error('Card element has no dimensions');
      }

      console.log(`Card dimensions: ${cardElement.offsetWidth}x${cardElement.offsetHeight}`);

      // Simple html2canvas options
      const options = {
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false
      };

      console.log('Generating canvas...');
      const canvas = await html2canvas(cardElement, options);
      
      if (!canvas) {
        throw new Error('Failed to generate canvas');
      }

      console.log(`Canvas generated: ${canvas.width}x${canvas.height}`);

      // Create download link
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = filename;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('PNG export completed successfully');
      return { success: true, format: 'png' };

    } catch (error) {
      console.error('PNG export failed:', error);
      throw error;
    } finally {
      this.isExporting = false;
    }
  }

  /**
   * Simple PDF export
   */
  async exportPDF(cardElement, filename = 'business-card.pdf') {
    if (this.isExporting) {
      throw new Error('Export already in progress');
    }

    console.log('Starting simple PDF export...');
    this.isExporting = true;

    try {
      // Validate element
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      if (!cardElement.offsetWidth || !cardElement.offsetHeight) {
        throw new Error('Card element has no dimensions');
      }

      // Generate canvas first
      const options = {
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false
      };

      console.log('Generating canvas for PDF...');
      const canvas = await html2canvas(cardElement, options);
      
      if (!canvas) {
        throw new Error('Failed to generate canvas for PDF');
      }

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'in',
        format: [3.5, 2]
      });

      // Convert canvas to image
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 0, 0, 3.5, 2);
      
      // Save PDF
      pdf.save(filename);

      console.log('PDF export completed successfully');
      return { success: true, format: 'pdf' };

    } catch (error) {
      console.error('PDF export failed:', error);
      throw error;
    } finally {
      this.isExporting = false;
    }
  }

  /**
   * Ultra-simple fallback export using basic canvas
   */
  async exportFallback(cardElement, filename = 'business-card.png') {
    console.log('Using ultra-simple fallback export...');

    try {
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Use minimal html2canvas options
      const canvas = await html2canvas(cardElement, {
        backgroundColor: '#ffffff',
        scale: 1
      });

      // Simple download
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return { success: true, format: 'png-fallback' };
    } catch (error) {
      console.error('Fallback export failed:', error);
      throw new Error('All export methods failed: ' + error.message);
    }
  }

  /**
   * Test if export functionality is working
   */
  async testExport() {
    try {
      // Create a test element
      const testDiv = document.createElement('div');
      testDiv.style.width = '200px';
      testDiv.style.height = '100px';
      testDiv.style.backgroundColor = '#007bff';
      testDiv.style.color = 'white';
      testDiv.style.padding = '20px';
      testDiv.style.position = 'absolute';
      testDiv.style.top = '-1000px';
      testDiv.innerHTML = 'Export Test';
      
      document.body.appendChild(testDiv);
      
      // Test export
      const canvas = await html2canvas(testDiv, { backgroundColor: '#ffffff' });
      document.body.removeChild(testDiv);
      
      return canvas.width > 0 && canvas.height > 0;
    } catch (error) {
      console.error('Export test failed:', error);
      return false;
    }
  }
}

// Create and export instance
const simpleCardExport = new SimpleCardExportService();
export default simpleCardExport; 