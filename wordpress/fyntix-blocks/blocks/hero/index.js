import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

registerBlockType('fyntix/hero', {
	edit: ({ attributes, setAttributes }) => {
		const { title, subtitle, ctaText, ctaUrl } = attributes;
		const blockProps = useBlockProps({
			className: 'fyntix-hero'
		});

		return (
			<>
				<InspectorControls>
					<PanelBody title={__('Hero Settings', 'fyntix-blocks')}>
						<TextControl
							label={__('CTA URL', 'fyntix-blocks')}
							value={ctaUrl}
							onChange={(value) => setAttributes({ ctaUrl: value })}
						/>
					</PanelBody>
				</InspectorControls>

				<section {...blockProps}>
					<div className="fyntix-hero__content container">
						<div className="fyntix-hero__inner">
							<RichText
								tagName="h1"
								className="fyntix-hero__title"
								value={title}
								onChange={(value) => setAttributes({ title: value })}
								placeholder={__('Enter hero title...', 'fyntix-blocks')}
							/>
							
							<RichText
								tagName="p"
								className="fyntix-hero__subtitle"
								value={subtitle}
								onChange={(value) => setAttributes({ subtitle: value })}
								placeholder={__('Enter subtitle...', 'fyntix-blocks')}
							/>
							
							<div className="fyntix-hero__cta">
								<RichText
									tagName="a"
									className="wp-block-button__link wp-element-button"
									value={ctaText}
									onChange={(value) => setAttributes({ ctaText: value })}
									placeholder={__('CTA text...', 'fyntix-blocks')}
								/>
							</div>
						</div>
					</div>
				</section>
			</>
		);
	},

	save: () => null, // Server-side rendering
});
