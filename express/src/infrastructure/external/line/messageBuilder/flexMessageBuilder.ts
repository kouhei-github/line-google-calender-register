import { FlexMessage, FlexContainer, FlexBubble, FlexCarousel, FlexBox, FlexImage, FlexVideo, FlexText, FlexButton } from '@line/bot-sdk';

export interface FlexMessageJSON {
  type: 'bubble' | 'carousel';
  contents: any;
}

export class FlexMessageConverter {
  public convert(json: FlexMessageJSON): FlexMessage {
    if (json.type === 'bubble') {
      return this.createBubbleMessage(json.contents);
    } else if (json.type === 'carousel') {
      return this.createCarouselMessage(json.contents);
    }
    throw new Error('Unsupported Flex Message type');
  }

  private createBubbleMessage(contents: any): FlexMessage {
    const bubble: FlexBubble = this.convertBubble(contents);
    return {
      type: 'flex',
      altText: 'This is a Flex Message',
      contents: bubble
    };
  }

  private createCarouselMessage(contents: any[]): FlexMessage {
    const carousel: FlexCarousel = {
      type: 'carousel',
      contents: contents.map(this.convertBubble)
    };
    return {
      type: 'flex',
      altText: 'This is a Flex Message',
      contents: carousel
    };
  }

  private convertBubble(bubble: any): FlexBubble {
    return {
      type: 'bubble',
      hero: this.convertHero(bubble.hero),
      body: this.convertBox(bubble.body),
      footer: this.convertBox(bubble.footer),
      styles: bubble.styles
    };
  }

  private convertHero(hero: any): FlexImage | FlexVideo | undefined {
    if (!hero) return undefined;
    if (hero.type === 'image') {
      return this.convertImage(hero);
    } else if (hero.type === 'video') {
      return this.convertVideo(hero);
    }
    throw new Error('Unsupported hero type');
  }

  private convertImage(image: any): FlexImage {
    return {
      type: 'image',
      url: image.url,
      ...this.extractCommonProperties(image)
    };
  }

  private convertVideo(video: any): FlexVideo {
    return {
      type: 'video',
      url: video.url,
      previewUrl: video.previewUrl,
      altContent: this.createAltContent(video),
      ...this.extractCommonProperties(video)
    };
  }

  private createAltContent(video: any): FlexVideo['altContent'] {
    return {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'text',
          text: video.altText || 'Video content',
          color: '#ffffff',
          align: 'center',
          gravity: 'center',
          size: 'md',
          wrap: true
        }
      ],
      backgroundColor: '#000000',
      alignItems: 'center',
      justifyContent: 'center'
    };
  }

  private convertBox(component: any): FlexBox | undefined {
    if (!component) return undefined;
    return {
      type: 'box',
      layout: component.layout,
      contents: component.contents?.map(this.convertComponent.bind(this)),
      ...this.extractCommonProperties(component)
    };
  }

  private convertComponent(component: any): FlexBox | FlexButton | FlexImage | FlexText | FlexVideo {
    switch (component.type) {
      case 'box':
        return this.convertBox(component) as FlexBox;
      case 'image':
        return this.convertImage(component);
      case 'video':
        return this.convertVideo(component);
      case 'text':
        return this.convertText(component);
      case 'button':
        return this.convertButton(component);
      default:
        throw new Error(`Unsupported component type: ${component.type}`);
    }
  }

  private convertText(text: any): FlexText {
    return {
      type: 'text',
      text: text.text,
      ...this.extractCommonProperties(text)
    };
  }

  private convertButton(button: any): FlexButton {
    return {
      type: 'button',
      action: button.action,
      ...this.extractCommonProperties(button)
    };
  }

  private extractCommonProperties(component: any) {
    const commonProps = ['backgroundColor', 'borderColor', 'borderWidth', 'cornerRadius', 'width', 'height', 'margin', 'paddingAll', 'paddingTop', 'paddingBottom', 'paddingStart', 'paddingEnd', 'action', 'alignItems', 'justifyContent'];
    return Object.fromEntries(
      Object.entries(component).filter(([key]) => commonProps.includes(key))
    );
  }
}