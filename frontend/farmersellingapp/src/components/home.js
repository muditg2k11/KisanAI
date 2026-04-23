import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from './header';
import Footer from './footer';

function Home() {
  const location = useLocation();

  useEffect(() => {
    // Check if the page has been refreshed in this session
    const hasRefreshed = sessionStorage.getItem('home_refreshed');

    if (!hasRefreshed) {
      // If not refreshed yet, set the flag and reload
      sessionStorage.setItem('home_refreshed', 'true');
      window.location.reload();
    }
  }, []);

  return (

    <div id="pxl-page" className="pxl-page header-pos-df">
      <Header />

      <div id="pxl-main" className="pxl-main page-builder-el">
        <div className="elementor-container pxl-page-content pxl-content-container">
          <div className="row pxl-content-wrap no-sidebar">
            <div id="pxl-content-area" className="pxl-content-area content-page col-12">
              <main id="pxl-content-main" className="pxl-content-main">
                <article id="post-4812" className="post-4812 page type-page status-publish hentry">
                  <div className="pxl-entry-content clearfix">
                    <div data-elementor-type="wp-page" data-elementor-id="4812" className="elementor elementor-4812">

                      <section className="elementor-section elementor-top-section elementor-element elementor-element-6e27664 elementor-section-full_width elementor-section-height-min-height elementor-section-height-default elementor-section-items-middle pxl-section-static-pos-no pxl-section-overflow-hidden-no pxl-container-margin-auto-no" data-id="6e27664" data-element_type="section">


                        <div className="elementor-container elementor-column-gap-no ">
                          <div className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-2c6187e pxl-column-element-default pxl-column-overflow-hidden-no" data-id="2c6187e" data-element_type="column">
                            <div className="elementor-widget-wrap elementor-element-populated">
                              <div className="elementor-element elementor-element-8fcf05f pxl-swiper-arrows-true pxl-swiper-dots-false pxl-swiper-dots-primary elementor-widget elementor-widget-pxl_slider" data-id="8fcf05f" data-element_type="widget" data-settings="{&quot;arrow_prev_position&quot;:&quot;absolute&quot;,&quot;arrow_next_position&quot;:&quot;absolute&quot;}" data-widget_type="pxl_slider.default">
                                <div className="elementor-widget-container">

                                  <div className="pxl-sliders-wrap effect-fade split-text-off-scroll animation-off-scroll">
                                    <div className="pxl-swiper-loader">
                                      <div className="pxl-swiper-loader-inner five-dots">
                                        <span className="dot"></span><span className="dot"></span><span className="dot"></span><span className="dot"></span><span className="dot"></span>
                                      </div>
                                    </div>
                                    <div className="pxl-slider-container" dir="ltr" data-settings="{&quot;slide_direction&quot;:&quot;horizontal&quot;,&quot;slide_percolumn&quot;:1,&quot;slide_percolumnfill&quot;:1,&quot;slide_mode&quot;:&quot;fade&quot;,&quot;slides_to_show&quot;:1,&quot;slides_to_scroll&quot;:1,&quot;slides_gutter&quot;:0,&quot;dots_style&quot;:&quot;bullets&quot;,&quot;dots_style_custom&quot;:&quot;&quot;,&quot;autoplay&quot;:false,&quot;pause_on_hover&quot;:false,&quot;pause_on_interaction&quot;:true,&quot;delay&quot;:5000,&quot;loop&quot;:true,&quot;speed&quot;:500,&quot;center_mode&quot;:false,&quot;split_text_on_scroll&quot;:false,&quot;animation_on_scroll&quot;:false}">
                                      <div className="pxl-slider-wrapper swiper-wrapper" data-count="3">
                                        <div className="pxl-slider-item swiper-slide">
                                          <div data-elementor-type="wp-post" data-elementor-id="5468" className="elementor elementor-5468">
                                            <section className="elementor-section elementor-top-section elementor-element elementor-element-7de74c5 elementor-section-height-min-height pxl-section-ken-burns pxl-ken-burns--in-out elementor-section-boxed elementor-section-height-default elementor-section-items-middle pxl-section-static-pos-no pxl-section-overflow-hidden-no pxl-container-margin-auto-no" data-id="7de74c5" data-element_type="section">

                                              <div className="pxl-ss-bg-ken-burns-wrap pxl-absoluted overflow-hidden"><div className="pxl-section-bg-ken-burns"></div></div>                    <div className="elementor-background-overlay"></div>

                                              <div className="elementor-container elementor-column-gap-default ">
                                                <div className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-f5e80e2 pxl-column-element-default pxl-column-overflow-hidden-no" data-id="f5e80e2" data-element_type="column">
                                                  <div className="elementor-widget-wrap elementor-element-populated">
                                                    <div className="elementor-element elementor-element-890d267 elementor-widget elementor-widget-pxl_heading" data-id="890d267" data-element_type="widget" data-widget_type="pxl_heading.default">
                                                      <div className="elementor-widget-container">
                                                        <div className="pxl-heading-wrap d-flex">
                                                          <div className="pxl-heading-inner  ">
                                                            <div className="heading-subtitle pxl-animate pxl-invisible animated-normal" data-settings="{&quot;animation&quot;:&quot;fadeInRight&quot;,&quot;animation_delay&quot;:0}">
                                                              <span className="subtitle-text ">Better Agriculture for Better Future</span>
                                                            </div>
                                                            <h1 className="heading-title pxl-split-text split-lines-rotation-x">
                                                              Every Crop Counts,<br /> Every Farmer Matters.</h1>
                                                          </div>
                                                        </div>

                                                      </div>
                                                    </div>
                                                    <div className="elementor-element elementor-element-362d51b elementor-widget__width-auto elementor-widget elementor-widget-pxl_image" data-id="362d51b" data-element_type="widget" data-widget_type="pxl_image.default">
                                                      <div className="elementor-widget-container">
                                                        <div id="pxl_image-362d51b-2691" className="pxl-image-wg d-flex pxl-draw-from-left default">
                                                          <img decoding="async" width="366" height="9" src="/assets/wp-content/uploads/2024/06/pt-layer.webp" className="attachment-full size-full wp-image-721" alt="" />			</div>		</div>
                                                    </div>
                                                    <div className="elementor-element elementor-element-2d6797b elementor-widget elementor-widget-pxl_text_editor" data-id="2d6797b" data-element_type="widget" data-widget_type="pxl_text_editor.default">
                                                      <div className="elementor-widget-container">
                                                        <div id="pxl_text_editor-2d6797b-2115" className="pxl-text-editor-wrap d-flex  pxl-animate pxl-invisible animated-normal" data-settings="{&quot;animation&quot;:&quot;fadeInUp&quot;,&quot;animation_delay&quot;:100}" >
                                                          <div className="pxl-text-editor elementor-clearfix">
                                                            <p>The paramount doctrine of the economic and technological euphoria of recent decades has been that everything depends on innovation.</p>
                                                          </div>
                                                        </div>		</div>
                                                    </div>
                                                    <div className="elementor-element elementor-element-a455222 elementor-widget__width-auto elementor-widget elementor-widget-pxl_button" data-id="a455222" data-element_type="widget" data-widget_type="pxl_button.default">
                                                      <div className="elementor-widget-container">
                                                        <div id="pxl_button-a455222-4510" className="pxl-button-wrapper d-flex align-items-center pxl-animate pxl-invisible animated-normal" data-settings="{&quot;animation&quot;:&quot;fadeInUp&quot;,&quot;animation_delay&quot;:100}" >
                                                          <a href="#services-section" className="pxl-btn btn-white icon-ps-right has-icon">
                                                            <span className="pxl-button-text">See Our Services</span>
                                                            <span className="pxl-icon"><i className="fas fa-chevron-right" style={{ fontSize: "14px" }}></i></span>    </a>
                                                        </div>		</div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </section>
                                          </div>
                                        </div>
                                        <div className="pxl-slider-item swiper-slide">
                                          <div data-elementor-type="wp-post" data-elementor-id="5496" className="elementor elementor-5496">
                                            <section className="elementor-section elementor-top-section elementor-element elementor-element-f4d18ca elementor-section-height-min-height elementor-section-boxed elementor-section-height-default elementor-section-items-middle pxl-section-static-pos-no pxl-section-overflow-hidden-no pxl-container-margin-auto-no" data-id="f4d18ca" data-element_type="section">

                                              <div className="pxl-section-bg-parallax-outer"><div className="pxl-section-bg-parallax" data-parallax="{&quot;y&quot;:-30}"></div></div>                    <div className="elementor-background-overlay"></div>

                                              <div className="elementor-container elementor-column-gap-default ">
                                                <div className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-256e39e pxl-column-element-default pxl-column-overflow-hidden-no" data-id="256e39e" data-element_type="column">
                                                  <div className="elementor-widget-wrap elementor-element-populated">
                                                    <div className="elementor-element elementor-element-42933b2 elementor-widget elementor-widget-pxl_heading" data-id="42933b2" data-element_type="widget" data-widget_type="pxl_heading.default">
                                                      <div className="elementor-widget-container">
                                                        <div className="pxl-heading-wrap d-flex">
                                                          <div className="pxl-heading-inner  ">
                                                            <div className="heading-subtitle">
                                                              <span className="subtitle-text  pxl-split-text split-in-scale">Better Agriculture for Better Future</span>
                                                            </div>
                                                            <h1 className="heading-title pxl-animate pxl-invisible animated-normal" data-settings="{&quot;animation&quot;:&quot;fadeInRight&quot;,&quot;animation_delay&quot;:0}">
                                                              Agriculture That Works<br /> For The Future</h1>
                                                          </div>
                                                        </div>

                                                      </div>
                                                    </div>
                                                    <div className="elementor-element elementor-element-fba2a33 elementor-widget__width-auto elementor-widget elementor-widget-pxl_image" data-id="fba2a33" data-element_type="widget" data-widget_type="pxl_image.default">
                                                      <div className="elementor-widget-container">
                                                        <div id="pxl_image-fba2a33-7120" className="pxl-image-wg d-flex pxl-draw-from-left default">
                                                          <img decoding="async" width="366" height="9" src="/assets/wp-content/uploads/2024/06/pt-layer.webp" className="attachment-full size-full wp-image-721" alt="" />			</div>		</div>
                                                    </div>
                                                    <div className="elementor-element elementor-element-9bfc4a4 elementor-widget elementor-widget-pxl_text_editor" data-id="9bfc4a4" data-element_type="widget" data-widget_type="pxl_text_editor.default">
                                                      <div className="elementor-widget-container">
                                                        <div id="pxl_text_editor-9bfc4a4-3342" className="pxl-text-editor-wrap d-flex  pxl-animate pxl-invisible animated-normal" data-settings="{&quot;animation&quot;:&quot;fadeInUp&quot;,&quot;animation_delay&quot;:100}" >
                                                          <div className="pxl-text-editor elementor-clearfix">
                                                            <p>The paramount doctrine of the economic and technological euphoria of recent decades has been that everything depends on innovation.</p>
                                                          </div>
                                                        </div>		</div>
                                                    </div>
                                                    <div className="elementor-element elementor-element-98d891f elementor-widget__width-auto elementor-widget elementor-widget-pxl_button" data-id="98d891f" data-element_type="widget" data-widget_type="pxl_button.default">
                                                      <div className="elementor-widget-container">
                                                        <div id="pxl_button-98d891f-6295" className="pxl-button-wrapper d-flex align-items-center pxl-animate pxl-invisible animated-normal" data-settings="{&quot;animation&quot;:&quot;fadeInUp&quot;,&quot;animation_delay&quot;:100}" >
                                                          <a href="#services-section" className="pxl-btn btn-white icon-ps-right has-icon">
                                                            <span className="pxl-button-text">See Our Services</span>
                                                            <span className="pxl-icon"><i className="fas fa-chevron-right" style={{ fontSize: "14px" }}></i></span>    </a>
                                                        </div>		</div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </section>
                                          </div>
                                        </div>
                                        <div className="pxl-slider-item swiper-slide">
                                          <div data-elementor-type="wp-post" data-elementor-id="5498" className="elementor elementor-5498">
                                            <section className="elementor-section elementor-top-section elementor-element elementor-element-815ea0c elementor-section-height-min-height elementor-section-boxed elementor-section-height-default elementor-section-items-middle pxl-section-static-pos-no pxl-section-overflow-hidden-no pxl-container-margin-auto-no" data-id="815ea0c" data-element_type="section">

                                              <div className="pxl-section-bg-parallax-outer"><div className="pxl-section-bg-parallax" data-parallax="{&quot;x&quot;:30}"></div></div>                    <div className="elementor-background-overlay"></div>

                                              <div className="elementor-container elementor-column-gap-default ">
                                                <div className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-9bb94fd pxl-column-element-default pxl-column-overflow-hidden-no" data-id="9bb94fd" data-element_type="column">
                                                  <div className="elementor-widget-wrap elementor-element-populated">
                                                    <div className="elementor-element elementor-element-983fa30 elementor-widget elementor-widget-pxl_heading" data-id="983fa30" data-element_type="widget" data-widget_type="pxl_heading.default">
                                                      <div className="elementor-widget-container">
                                                        <div className="pxl-heading-wrap d-flex">
                                                          <div className="pxl-heading-inner  ">
                                                            <div className="heading-subtitle pxl-animate pxl-invisible animated-normal" data-settings="{&quot;animation&quot;:&quot;fadeInUp&quot;,&quot;animation_delay&quot;:0}">
                                                              <span className="subtitle-text ">Better Agriculture for Better Future</span>
                                                            </div>
                                                            <h1 className="heading-title pxl-split-text split-words-scale">
                                                              Every Day Is A Good<br /> Day To Be A Farmer</h1>
                                                          </div>
                                                        </div>

                                                      </div>
                                                    </div>
                                                    <div className="elementor-element elementor-element-8163fd0 elementor-widget__width-auto elementor-widget elementor-widget-pxl_image" data-id="8163fd0" data-element_type="widget" data-widget_type="pxl_image.default">
                                                      <div className="elementor-widget-container">
                                                        <div id="pxl_image-8163fd0-4342" className="pxl-image-wg d-flex pxl-draw-from-left default">
                                                          <img decoding="async" width="366" height="9" src="/assets/wp-content/uploads/2024/06/pt-layer.webp" className="attachment-full size-full wp-image-721" alt="" />			</div>		</div>
                                                    </div>
                                                    <div className="elementor-element elementor-element-f2e5dfd elementor-widget elementor-widget-pxl_text_editor" data-id="f2e5dfd" data-element_type="widget" data-widget_type="pxl_text_editor.default">
                                                      <div className="elementor-widget-container">
                                                        <div id="pxl_text_editor-f2e5dfd-4986" className="pxl-text-editor-wrap d-flex  pxl-animate pxl-invisible animated-normal" data-settings="{&quot;animation&quot;:&quot;fadeInRight&quot;,&quot;animation_delay&quot;:200}" >
                                                          <div className="pxl-text-editor elementor-clearfix">
                                                            <p>The paramount doctrine of the economic and technological euphoria of recent decades has been that everything depends on innovation.</p>
                                                          </div>
                                                        </div>		</div>
                                                    </div>
                                                    <div className="elementor-element elementor-element-0c18f6f elementor-widget__width-auto elementor-widget elementor-widget-pxl_button" data-id="0c18f6f" data-element_type="widget" data-widget_type="pxl_button.default">
                                                      <div className="elementor-widget-container">
                                                        <div id="pxl_button-0c18f6f-2958" className="pxl-button-wrapper d-flex align-items-center pxl-animate pxl-invisible animated-normal" data-settings="{&quot;animation&quot;:&quot;fadeInUp&quot;,&quot;animation_delay&quot;:100}" >
                                                          <a href="#services-section" className="pxl-btn btn-white icon-ps-right has-icon">
                                                            <span className="pxl-button-text">See Our Services</span>
                                                            <span className="pxl-icon"><i className="fas fa-chevron-right" style={{ fontSize: "14px" }}></i></span>    </a>
                                                        </div>		</div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </section>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="pxl-slider-arrow-wrap pxl-slider-arrows-absolute  " data-settings="">
                                        <div className="pxl-slider-arrow pxl-slider-arrow-prev">
                                          <span className="pxl-icon"><i className="fas fa-chevron-left" style={{ fontSize: '28px', color: '#fff' }}></i></span>
                                        </div>

                                        <div className="pxl-slider-arrow pxl-slider-arrow-next">
                                          <span className="pxl-icon"><i className="fas fa-chevron-right" style={{ fontSize: '28px', color: '#fff' }}></i></span>		        </div>
                                      </div>

                                    </div>
                                  </div>

                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>




                      <section style={{ marginBottom: '10em' }} className="elementor-section elementor-top-section elementor-element elementor-element-2d50bb4 elementor-section-boxed elementor-section-height-default elementor-section-height-default pxl-section-static-pos-no pxl-section-overflow-hidden-no pxl-container-margin-auto-no" data-id="2d50bb4" data-element_type="section" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
                        <div className="pxl-section-bg-parallax-outer"><div className="pxl-section-bg-parallax" data-parallax="{&quot;y&quot;:-80}" /></div><div className="pxl-section-divider-bot-img" />
                        <div className="elementor-container elementor-column-gap-default ">
                          <div className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-8670540 pxl-column-element-default pxl-column-overflow-hidden-no" data-id={8670540} data-element_type="column">
                            <div className="elementor-widget-wrap elementor-element-populated">
                              <div className="elementor-element elementor-element-acb979b elementor-widget elementor-widget-pxl_heading" data-id="acb979b" data-element_type="widget" data-widget_type="pxl_heading.default">
                                <div className="elementor-widget-container">
                                  <div className="pxl-heading-wrap d-flex">
                                    <div className="pxl-heading-inner center ">
                                      <div className="heading-subtitle">
                                        <span className="subtitle-text ">What Is Our Expertise?</span>
                                      </div>
                                      <h2 className="heading-title">
                                        We Providing The <br />
                                        Best Agricultural Services       </h2>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="elementor-element elementor-element-247c965 elementor-widget elementor-widget-pxl_text_editor" data-id="247c965" data-element_type="widget" data-widget_type="pxl_text_editor.default">
                                <div className="elementor-widget-container">
                                  <div id="pxl_text_editor-247c965-4292" className="pxl-text-editor-wrap d-flex ">
                                    <div className="pxl-text-editor elementor-clearfix">
                                      <p>Duis eleifend euismod arcu, nec faucibus mauris finibus id. Integer mattis, tellus non finibus rutrum.</p>
                                    </div>
                                  </div>		</div>
                              </div>
                              <div className="elementor-element elementor-element-2a684c3 elementor-widget elementor-widget-pxl_image" data-id="2a684c3" data-element_type="widget" data-widget_type="pxl_image.default">
                                <div className="elementor-widget-container">
                                  <div id="pxl_image-2a684c3-2021" className="pxl-image-wg d-flex pxl-draw-from-left default">
                                    <img decoding="async" width={81} height={15} src="/assets/wp-content/uploads/2024/06/pxl-heading-shap.webp" className="attachment-full size-full wp-image-1057" alt />			</div>		</div>
                              </div>
                              <section className="elementor-section elementor-inner-section elementor-element elementor-element-4f24e2f elementor-section-full_width elementor-section-height-default elementor-section-height-default pxl-section-static-pos-no pxl-section-overflow-hidden-no pxl-container-margin-auto-no" data-id="4f24e2f" data-element_type="section">
                                <div className="elementor-container elementor-column-gap-default ">
                                  <div className="elementor-column elementor-col-25 elementor-inner-column elementor-element elementor-element-a628b8e pxl-column-element-default pxl-column-overflow-hidden-no" data-id="a628b8e" data-element_type="column">
                                    <div className="elementor-widget-wrap elementor-element-populated">
                                      <div className="elementor-element elementor-element-b6af500 elementor-invisible pxl-elementor-animate elementor-widget elementor-widget-pxl_fancy_box" data-id="b6af500" data-element_type="widget" data-settings="{&quot;_animation&quot;:&quot;fadeInUp&quot;,&quot;_animation_delay&quot;:0}" data-widget_type="pxl_fancy_box.default">
                                        <div className="elementor-widget-container">
                                          <div className="pxl-fancybox-wrap d-flex text-center layout-4">
                                            <div className="fancybox-inner relative">
                                              <div className="pxl-fancy-icon relative">
                                                <span className="pxl-icon">
                                                  <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" id="Capa_1" x="0px" y="0px" viewBox="0 0 57.569 57.569" style={{ enableBackground: 'new 0 0 57.569 57.569' }} xmlSpace="preserve"><g>	<path d="M10.553,27.865c0-1.647,0.488-3.231,1.395-4.572c-0.298-0.962-0.452-1.97-0.452-2.969c0-4.308,2.715-8.061,6.651-9.47  c0.351-3.212,2.411-5.976,5.314-7.299c-1.492-2.415-3.847-3.831-6.018-3.479c-1.569,0.255-2.869,1.321-3.633,2.93  c-1.375-0.632-2.805-0.737-4.059-0.296C8.394,3.188,7.34,4.21,6.703,5.665c-0.845,1.927-0.846,4.407-0.029,6.765  c-1.101,0.756-1.924,1.867-2.405,3.26c-0.809,2.339-0.539,5.161,0.74,7.746c0.14,0.282,0.293,0.562,0.46,0.837  c-1.201,0.781-2.1,1.939-2.582,3.352c-0.766,2.242-0.427,4.884,0.93,7.246c0.623,1.085,1.448,2.068,2.409,2.876  c-0.321,1.344-0.078,2.821,0.704,4.158c1.093,1.865,3.062,3.13,5.166,3.343c2.818,5.296,6.224,7.998,11.095,10.339  c-5.787-6.841-9.005-12.507-9.186-21.051C11.875,33.015,10.553,30.516,10.553,27.865z" />	<path d="M55.083,20.053c0.08-3.894-2.207-7.397-5.751-8.911c-0.517-3.323-3.195-5.92-6.523-6.36  c-0.03-0.331-0.093-0.661-0.188-0.987c-0.587-2.004-2.354-3.513-4.395-3.755c-1.335-0.159-2.597,0.176-3.64,0.909  c-0.93-0.615-2.013-0.947-3.123-0.947c-2.859,0-5.235,2.112-5.649,4.858c-3.269,0.66-5.72,3.573-5.72,6.981  c0,0.183,0.008,0.366,0.022,0.552c-3.79,0.682-6.62,3.975-6.62,7.932c0,1.144,0.247,2.278,0.721,3.321  c-1.065,1.139-1.663,2.638-1.663,4.22c0,2.364,1.358,4.508,3.445,5.54c-0.092,9.063,3.209,14.565,9.649,21.979l0.363,0.413  l0.066,0.075c0.976,1.095,2.381,1.697,3.958,1.697c0.273,0,0.542-0.023,0.807-0.057L30.5,56.849  c-2.149-5.111-3.468-9.649-4.204-13.683c-2.773-0.854-3.972-3.07-4.025-3.172c-0.258-0.488-0.069-1.094,0.419-1.351  c0.485-0.257,1.088-0.071,1.349,0.414c0.037,0.069,0.619,1.093,1.892,1.791c-0.348-2.617-0.449-5.007-0.348-7.161  c-0.012-0.109-0.007-0.216,0.018-0.326c0.174-3.079,0.736-5.685,1.478-7.869c-3.369-2.009-3.785-5.749-3.495-7.564  c0.087-0.545,0.601-0.922,1.145-0.83c0.545,0.087,0.916,0.598,0.831,1.142c-0.025,0.161-0.474,3.478,2.254,5.344  c0.136-0.315,0.273-0.628,0.415-0.921c2.63-5.428,6.389-8.129,7.844-9.02c-0.003-2.003,1.31-3.743,1.372-3.824  c0.335-0.439,0.965-0.521,1.401-0.187c0.438,0.335,0.522,0.962,0.188,1.4c-0.223,0.296-0.661,1.033-0.857,1.844  c2.303-0.261,4.551,1.039,4.665,1.107c0.477,0.281,0.634,0.894,0.354,1.369c-0.187,0.316-0.521,0.492-0.862,0.492  c-0.173,0-0.347-0.044-0.506-0.138c-0.697-0.407-2.819-1.306-4.273-0.61c-0.253,0.129-1.955,1.045-3.892,3.066  c3.967-0.289,6.726,0.889,6.865,0.949c0.505,0.223,0.735,0.813,0.514,1.318c-0.165,0.374-0.532,0.598-0.917,0.598  c-0.133,0-0.269-0.026-0.399-0.084c-0.075-0.032-3.458-1.434-7.942-0.501c-0.898,1.263-1.762,2.777-2.478,4.581  c-0.002,0.132-0.029,0.266-0.087,0.394c-0.038,0.085-0.089,0.159-0.145,0.227c-0.569,1.559-1.028,3.312-1.304,5.292  c2.261-1.418,5.113-1.48,5.276-1.482c0.004,0,0.008,0,0.012,0c0.546,0,0.991,0.438,0.999,0.986  c0.008,0.552-0.434,1.005-0.985,1.014c-0.042,0.001-4.157,0.097-5.557,2.484c-0.098,2.439,0.071,5.162,0.591,8.192  c0.005,0.023,0.008,0.046,0.011,0.07c0.7,4.039,2.016,8.61,4.197,13.799l0.476,0.918c0.734-0.37,1.366-0.882,1.817-1.512  c0.753-1.052,0.931-2.328,0.499-3.593c-1.808-5.305-1.752-9.353,0.166-12.033c2.486-3.475,7.664-3.994,10.528-3.994  c1.475,0,2.488,0.136,2.498,0.138l1.028,0.14l0.103-1.032c0.014-0.136,0.309-3.358-1.571-5.547  c-0.109-0.127-0.224-0.247-0.342-0.362c0.531-0.119,1.056-0.288,1.572-0.506C52.652,27.113,55.006,23.751,55.083,20.053z" /></g><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /></svg>              </span>
                                              </div>
                                              <div className="pxl-fancybox-content relative">
                                                <h4 className="title pxl-heading">
                                                  Clean Vegetables          </h4>
                                                <div className="divider" />
                                                <div className="desc">
                                                  Ultrices sagittis orci a scelerisque purus semper eget duis at. Sollicitudin nibh sit amet commodo nulla.          </div>
                                                <a className="link-readmore d-inline-flex" href="/assets/services/clean-vegetables/" target="_blank">                <span className="icon-readmore d-inline-flex">
                                                  <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 986.06 250.15"><path className="cls-1" d="M1104,159.89c-310.41-20.26-620.86-24.67-931.39.75-.2-1.38-.39-2.75-.59-4.13,2.07-.81,4.1-2.12,6.22-2.37,36.74-4.41,73.47-8.92,110.24-13,171.87-18.92,344.23-20,516.61-16.56,93.56,1.88,187.07,7.21,280.6,11,3.34.14,6.67,0,11.64,0-40.79-36.36-82.36-69-120.66-106.37l1.63-3.08c2.45,1.15,5.09,1.95,7.32,3.51q54.2,37.7,108.3,75.54c14.1,9.84,28.16,19.77,42.44,29.26,14,9.32,15.06,19.3,2.16,30.78A117.32,117.32,0,0,1,1117,180.76q-73.41,39.88-147.17,78.9a50.76,50.76,0,0,1-18.18,5.06c-2.55.27-6.9-2.78-7.73-5.43s.81-8,2.91-9.86c4.29-3.9,9.51-6.58,14.54-9.27q71.56-38.37,143.2-76.55C1104.34,162.37,1104.16,161.13,1104,159.89Z" transform="translate(-166.49 -19.59)" /></svg>              </span>
                                                </a>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="elementor-column elementor-col-25 elementor-inner-column elementor-element elementor-element-540855f pxl-column-element-default pxl-column-overflow-hidden-no" data-id="540855f" data-element_type="column">
                                    <div className="elementor-widget-wrap elementor-element-populated">
                                      <div className="elementor-element elementor-element-3802672 elementor-invisible pxl-elementor-animate elementor-widget elementor-widget-pxl_fancy_box" data-id={3802672} data-element_type="widget" data-settings="{&quot;_animation&quot;:&quot;fadeInUp&quot;,&quot;_animation_delay&quot;:100}" data-widget_type="pxl_fancy_box.default">
                                        <div className="elementor-widget-container">
                                          <div className="pxl-fancybox-wrap d-flex text-center layout-4">
                                            <div className="fancybox-inner relative">
                                              <div className="pxl-fancy-icon relative">
                                                <span className="pxl-icon">
                                                  <svg xmlns="http://www.w3.org/2000/svg" id="Solid" viewBox="0 0 64 64"><path d="m34.75 26.929a11.245 11.245 0 0 0 14.987 10.609 46.747 46.747 0 0 0 2.013-12.609 22.862 22.862 0 0 0 -1.41-8.378 11.248 11.248 0 0 0 -15.59 10.378zm6.25-.25a1.75 1.75 0 1 1 1.75-1.75 1.751 1.751 0 0 1 -1.75 1.75z" /><path d="m46 41.679a14.75 14.75 0 1 1 1.855-29.379c-4.255-5.1-11.095-6.121-15.855-6.121-7.376 0-19.75 2.435-19.75 18.75 0 7.044 2.5 15.908 6.113 23.167 2.188-2.809 6.462-4.918 13.637-4.918s11.449 2.109 13.637 4.922a62.641 62.641 0 0 0 2.822-6.626 14.764 14.764 0 0 1 -2.459.205zm-23-15a1.75 1.75 0 1 1 1.75-1.75 1.751 1.751 0 0 1 -1.75 1.75z" /><path d="m60.75 2a1.75 1.75 0 0 0 -3.067-1.152 21.661 21.661 0 0 1 -10.064 6.474 18.724 18.724 0 0 1 6.212 8.726 17.727 17.727 0 0 0 6.919-14.048z" /><path d="m16.381 7.322a21.67 21.67 0 0 1 -10.064-6.475 1.75 1.75 0 0 0 -3.067 1.153 17.727 17.727 0 0 0 6.919 14.048 18.724 18.724 0 0 1 6.212-8.726z" /><path d="m59.191 26.413a11.677 11.677 0 0 0 -3.954-2.127c0 .214.013.426.013.643a47.964 47.964 0 0 1 -1.45 10.971 15.971 15.971 0 0 0 8.361 1.741 1.751 1.751 0 0 0 1.587-1.891c-.025-.24-.555-5.979-4.557-9.337z" /><path d="m8.763 24.286a11.677 11.677 0 0 0 -3.954 2.127c-4 3.358-4.532 9.1-4.553 9.34a1.751 1.751 0 0 0 1.587 1.891 15.971 15.971 0 0 0 8.357-1.744 47.964 47.964 0 0 1 -1.45-10.971c0-.217.008-.429.013-.643z" /><path d="m32 46.678c-6.627 0-12 2.123-12 6.857s5.373 10.286 12 10.286 12-5.552 12-10.286-5.373-6.857-12-6.857zm-4 9.75a1.75 1.75 0 1 1 1.75-1.75 1.75 1.75 0 0 1 -1.75 1.75zm8 0a1.75 1.75 0 1 1 1.75-1.75 1.75 1.75 0 0 1 -1.75 1.75z" /></svg>              </span>
                                              </div>
                                              <div className="pxl-fancybox-content relative">
                                                <h4 className="title pxl-heading">
                                                  Pure Cow's Milk          </h4>
                                                <div className="divider" />
                                                <div className="desc">
                                                  Ultrices sagittis orci a scelerisque purus semper eget duis at. Sollicitudin nibh sit amet commodo nulla.          </div>
                                                <a className="link-readmore d-inline-flex" href="/assets/services/pure-cows-milk/" target="_blank">                <span className="icon-readmore d-inline-flex">
                                                  <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 986.06 250.15"><path className="cls-1" d="M1104,159.89c-310.41-20.26-620.86-24.67-931.39.75-.2-1.38-.39-2.75-.59-4.13,2.07-.81,4.1-2.12,6.22-2.37,36.74-4.41,73.47-8.92,110.24-13,171.87-18.92,344.23-20,516.61-16.56,93.56,1.88,187.07,7.21,280.6,11,3.34.14,6.67,0,11.64,0-40.79-36.36-82.36-69-120.66-106.37l1.63-3.08c2.45,1.15,5.09,1.95,7.32,3.51q54.2,37.7,108.3,75.54c14.1,9.84,28.16,19.77,42.44,29.26,14,9.32,15.06,19.3,2.16,30.78A117.32,117.32,0,0,1,1117,180.76q-73.41,39.88-147.17,78.9a50.76,50.76,0,0,1-18.18,5.06c-2.55.27-6.9-2.78-7.73-5.43s.81-8,2.91-9.86c4.29-3.9,9.51-6.58,14.54-9.27q71.56-38.37,143.2-76.55C1104.34,162.37,1104.16,161.13,1104,159.89Z" transform="translate(-166.49 -19.59)" /></svg>              </span>
                                                </a>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="elementor-column elementor-col-25 elementor-inner-column elementor-element elementor-element-56cb9ec pxl-column-element-default pxl-column-overflow-hidden-no" data-id="56cb9ec" data-element_type="column">
                                    <div className="elementor-widget-wrap elementor-element-populated">
                                      <div className="elementor-element elementor-element-8d6c91a elementor-invisible pxl-elementor-animate elementor-widget elementor-widget-pxl_fancy_box" data-id="8d6c91a" data-element_type="widget" data-settings="{&quot;_animation&quot;:&quot;fadeInUp&quot;,&quot;_animation_delay&quot;:200}" data-widget_type="pxl_fancy_box.default">
                                        <div className="elementor-widget-container">
                                          <div className="pxl-fancybox-wrap d-flex text-center layout-4">
                                            <div className="fancybox-inner relative">
                                              <div className="pxl-fancy-icon relative">
                                                <span className="pxl-icon">
                                                  <svg xmlns="http://www.w3.org/2000/svg" id="Glyph" height={512} viewBox="0 0 32 32" width={512}><path d="m13.693 7.654c-1.21-1.664-.821-5.654 1.307-5.654 1.032 0 1.872 1.178 1.979 2.684.57-1.206 2.009-2.867 3.021-2.282 1.307.754-.331 4.135-1.551 5.274-.768-.115-1.583-.176-2.449-.176-.812 0-1.581.053-2.307.154z" /><path d="m25 17c0-6-4.029-8-9-8s-9 2-9 8c0 4.336 1.976 7.833 1.07 12.621-.027.142.114.257.244.193l3.55-1.748c.085-.042.185-.042.271.001l3.729 1.864c.086.043.187.043.272 0l3.731-1.865c.084-.042.183-.043.267-.002l3.56 1.703c.129.062.266-.051.241-.192-.844-4.737 1.065-8.173 1.065-12.575zm-14 0c-.552 0-1-.448-1-1s.448-1 1-1 1 .448 1 1-.448 1-1 1zm7.865 2.416-2.632 4.212c-.107.172-.358.172-.465 0l-2.632-4.212c-.076-.122-.045-.289.07-.375 1.863-1.388 3.726-1.388 5.589 0 .115.086.146.253.07.375zm2.135-2.416c-.552 0-1-.448-1-1s.448-1 1-1 1 .448 1 1-.448 1-1 1z" /></svg>              </span>
                                              </div>
                                              <div className="pxl-fancybox-content relative">
                                                <h4 className="title pxl-heading">
                                                  Clean Chicken And Eggs          </h4>
                                                <div className="divider" />
                                                <div className="desc">
                                                  Ultrices sagittis orci a scelerisque purus semper eget duis at. Sollicitudin nibh sit amet commodo nulla.          </div>
                                                <a className="link-readmore d-inline-flex" href="/assets/services/clean-chicken-and-eggs/" target="_blank">                <span className="icon-readmore d-inline-flex">
                                                  <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 986.06 250.15"><path className="cls-1" d="M1104,159.89c-310.41-20.26-620.86-24.67-931.39.75-.2-1.38-.39-2.75-.59-4.13,2.07-.81,4.1-2.12,6.22-2.37,36.74-4.41,73.47-8.92,110.24-13,171.87-18.92,344.23-20,516.61-16.56,93.56,1.88,187.07,7.21,280.6,11,3.34.14,6.67,0,11.64,0-40.79-36.36-82.36-69-120.66-106.37l1.63-3.08c2.45,1.15,5.09,1.95,7.32,3.51q54.2,37.7,108.3,75.54c14.1,9.84,28.16,19.77,42.44,29.26,14,9.32,15.06,19.3,2.16,30.78A117.32,117.32,0,0,1,1117,180.76q-73.41,39.88-147.17,78.9a50.76,50.76,0,0,1-18.18,5.06c-2.55.27-6.9-2.78-7.73-5.43s.81-8,2.91-9.86c4.29-3.9,9.51-6.58,14.54-9.27q71.56-38.37,143.2-76.55C1104.34,162.37,1104.16,161.13,1104,159.89Z" transform="translate(-166.49 -19.59)" /></svg>              </span>
                                                </a>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="elementor-column elementor-col-25 elementor-inner-column elementor-element elementor-element-e984c57 pxl-column-element-default pxl-column-overflow-hidden-no" data-id="e984c57" data-element_type="column">
                                    <div className="elementor-widget-wrap elementor-element-populated">
                                      <div className="elementor-element elementor-element-47815df elementor-invisible pxl-elementor-animate elementor-widget elementor-widget-pxl_fancy_box" data-id="47815df" data-element_type="widget" data-settings="{&quot;_animation&quot;:&quot;fadeInUp&quot;,&quot;_animation_delay&quot;:300}" data-widget_type="pxl_fancy_box.default">
                                        <div className="elementor-widget-container">
                                          <div className="pxl-fancybox-wrap d-flex text-center layout-4">
                                            <div className="fancybox-inner relative">
                                              <div className="pxl-fancy-icon relative">
                                                <span className="pxl-icon">
                                                  <svg xmlns="http://www.w3.org/2000/svg" height={512} viewBox="0 0 512 512" width={512}><g id="_x33_3_Seed_Bag"><g><path d="m447.138 463.576c-7.991-10.54-11.113-23.987-8.077-36.86 28.529-120.972 28.528-220.475-.004-341.449-3.015-12.784-.015-26.178 7.921-36.643 11.735-15.474 19.927-34.584 10.245-44.265-9.944-9.943-29.115-1.315-44.285 10.233-9.967 7.588-22.617 10.732-34.905 8.3-87.381-17.296-178.033-15.802-264.847 4.485-15.039-16.479-45.361-36.065-58.408-23.017-9.884 9.884-1.428 28.88 10.085 44.066 7.991 10.539 11.112 23.985 8.076 36.859-28.529 120.971-28.528 220.475.004 341.448 3.015 12.783.015 26.178-7.921 36.643-11.735 15.473-19.926 34.581-10.244 44.264 9.944 9.943 29.115 1.315 44.284-10.234 9.967-7.588 22.617-10.732 34.905-8.3 80.442 15.924 163.656 15.921 244.096-.007 12.194-2.414 24.788.614 34.684 8.136 15.435 11.73 34.752 20.126 44.475 10.404 9.885-9.883 1.429-28.878-10.084-44.063zm-63.873-93.333c0 17.999-14.642 32.641-32.641 32.641h-189.248c-17.999 0-32.641-14.642-32.641-32.641v-228.486c0-17.999 14.642-32.641 32.641-32.641h189.247c17.999 0 32.641 14.642 32.641 32.641v228.486z" /><path d="m350.625 119.996h-189.25c-12.018 0-21.761 9.742-21.761 21.761v228.487c0 12.018 9.743 21.761 21.761 21.761h189.25c12.018 0 21.761-9.743 21.761-21.761v-228.487c0-12.019-9.743-21.761-21.761-21.761zm-159.798 176.914c-22.74-22.74-16.538-65.772-16.538-65.772s20.292-2.937 40.366 2.557c-2.666 6.909-4.352 14.363-4.352 22.251 0 25.405 17.572 46.785 29.159 58.155-14.525-.435-35.198-3.754-48.635-17.191zm65.176 17.307s-34.821-26.085-34.822-58.253c-.001-32.167 34.817-58.183 34.817-58.183s34.821 26.021 34.822 58.189-34.817 58.247-34.817 58.247zm65.17-17.307c-13.437 13.437-34.11 16.755-48.635 17.19 11.588-11.37 29.16-32.75 29.16-58.155 0-7.888-1.686-15.342-4.352-22.251 20.074-5.494 40.366-2.557 40.366-2.557s6.201 43.033-16.539 65.773z" /></g></g></svg>              </span>
                                              </div>
                                              <div className="pxl-fancybox-content relative">
                                                <h4 className="title pxl-heading">
                                                  Fertilizer Products          </h4>
                                                <div className="divider" />
                                                <div className="desc">
                                                  Ultrices sagittis orci a scelerisque purus semper eget duis at. Sollicitudin nibh sit amet commodo nulla.          </div>
                                                <a className="link-readmore d-inline-flex" href="/assets/services/fertilizer-products/" target="_blank">                <span className="icon-readmore d-inline-flex">
                                                  <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 986.06 250.15"><path className="cls-1" d="M1104,159.89c-310.41-20.26-620.86-24.67-931.39.75-.2-1.38-.39-2.75-.59-4.13,2.07-.81,4.1-2.12,6.22-2.37,36.74-4.41,73.47-8.92,110.24-13,171.87-18.92,344.23-20,516.61-16.56,93.56,1.88,187.07,7.21,280.6,11,3.34.14,6.67,0,11.64,0-40.79-36.36-82.36-69-120.66-106.37l1.63-3.08c2.45,1.15,5.09,1.95,7.32,3.51q54.2,37.7,108.3,75.54c14.1,9.84,28.16,19.77,42.44,29.26,14,9.32,15.06,19.3,2.16,30.78A117.32,117.32,0,0,1,1117,180.76q-73.41,39.88-147.17,78.9a50.76,50.76,0,0,1-18.18,5.06c-2.55.27-6.9-2.78-7.73-5.43s.81-8,2.91-9.86c4.29-3.9,9.51-6.58,14.54-9.27q71.56-38.37,143.2-76.55C1104.34,162.37,1104.16,161.13,1104,159.89Z" transform="translate(-166.49 -19.59)" /></svg>              </span>
                                                </a>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </section>
                            </div>
                          </div>
                        </div>
                      </section>

















                    </div>
                  </div>
                </article>

              </main>
            </div>

          </div>
        </div>
      </div>


      <Footer />




    </div>
  );
}

export default Home;
